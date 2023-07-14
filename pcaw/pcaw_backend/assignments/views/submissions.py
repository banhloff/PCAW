from rest_framework import status, viewsets, generics, permissions
from rest_framework.response import Response
from assignments.serializers.submissions import SubmissionSerializer, SubmissionPostSerializer,\
                                            SubmissionRepresentSerializer
from permissions.permissions import IsOwnerOrStaff, SubmissionPermission, SubmissionViewSetAction
from assignments.models.assignments import Assignment
from assignments.models.submissions import Submission
from rest_framework.decorators import action
from django.conf import settings
from utils.utils import is_teacher
import requests
import json
from fuzzywuzzy import fuzz, process
from zipfile import ZipFile
import re #regex
import time
import traceback
from django.utils import timezone
import datetime
from rest_framework.pagination import PageNumberPagination
PARAM_PAGING = 'paging'
class SubmissionViewSet(viewsets.ModelViewSet):
    pagination_class = PageNumberPagination #already default in settings.py
    pagination_class.page_size = 5
    #parameter ?page=
    permission_classes =  (SubmissionPermission,)

    def has_submit_permission(self, request, assignment):
        return assignment.in_class in request.user.studies_classes.all() \
            and assignment.is_open and not assignment.is_deleted
    
    def check_lang(self, lang, assignment):
        if assignment.langs.all().count() == 0:
            return True
        allowed_langs = []
        for l in assignment.langs.all():
            allowed_langs.append(l.name)
        return lang in allowed_langs

    def process_submission(self, submission, version_index):
         #read input + output from zip file
        inputfile_pattern = re.compile(settings.INPUT_FILENAME_REGEX)
        inputfile_weighed_pattern = re.compile(settings.INPUT_FILENAME_WEIGHED_REGEX)
        outputfile_pattern = re.compile(settings.OUTPUT_FILENAME_REGEX)

        correct_count = 0
        total_test = 0
        correct_weight = 0
        total_weight = 0
        #if assignment doesn't have test cases
        if submission.assignment.io_file is None or submission.assignment.io_file == '':
            submission.status = settings.SUBMISSION_STATUS_NOTCHECKED
            submission.score = 0
            submission.save()
            response_data = {
                "message" : "Submit Succeeded! Submission not checked since there's no test case!",
                "correct_count": correct_count,
                "total_test": total_test,
                "status" : status.HTTP_200_OK
            }
            return response_data
        #else
        try:

            with ZipFile(submission.assignment.io_file, "r") as f:
                input_list =[]
                output_list =[]

                #get txt files with correct name
                for name in f.namelist():
                    if inputfile_pattern.match(name.split('.')[0]): #split off '.txt'
                        input_list.append(name)
                    elif inputfile_weighed_pattern.match(name.split('.')[0]):
                        input_list.append(name)
                    elif outputfile_pattern.match(name.split('.')[0]):
                        output_list.append(name)
                input_list.sort()
                output_list.sort()

                #if input & output name's number matches. e.g: input_1 output_1
                error_flag = False
                infos=[]

                for i in input_list:
                    weighted = False
                    tc_weight = 0
                    if inputfile_weighed_pattern.match(i.split('.')[0]):
                        weighted = True
                        # input_1_10.txt -> 10.txt -> 10
                        tc_weight = int((i.split('_')[2]).split('.')[0])
                        total_weight += tc_weight
                    else: # if weight not specified, default to 1
                                total_weight += 1
                    if error_flag:
                        break
                    for o in output_list:
                        input_index = ""
                        if not weighted:
                            # input_1.txt -> 1.txt -> 1
                            input_index = (i.split('_')[1]).split('.')[0]
                        else:
                            # input_1_10.txt -> 1
                            input_index = i.split('_')[1]
                        # output_1.txt -> 1.txt -> 1
                        output_index = (o.split('_')[1]).split('.')[0]
                        if input_index == output_index:
                            total_test += 1

                            file_input = f.read(i).decode("utf-8") 
                            
                            file_output = f.read(o).decode("utf-8") 
                            #send request with file input
                            payload = {
                                "script": submission.content,
                                "stdin": file_input,
                                "language": submission.lang,
                                "versionIndex": version_index,
                                
                                "clientId": settings.JDOODLE_CLIENT_ID,
                                "clientSecret": settings.JDOODLE_CLIENT_KEY
                            }
                            
                            results = requests.post(url=settings.JDOODLE_PATH, 
                                headers = {"Content-Type" : "application/json"}, 
                                data=json.dumps(payload))
                            #result data
                            result_data = results.json()
                            output = result_data.get('output')
                            memory = result_data.get('memory')
                            cpu = result_data.get('cpuTime')
                            rq_status = result_data.get('statusCode')
                            #error only sent when failed
                            rq_error = result_data.get('error')
                            info={}
                            info["cpu"] = cpu 
                            info["memory"] = memory
                            info["output"] =  output.strip()
                           
                            #compare output
                            infos.append({"info case " + str(total_test): info})
                            if output.strip() == file_output.strip():
                                correct_count += 1
                                if weighted: # e.g: input_1_10 -> get weight = 10
                                    correct_weight += tc_weight
                                else: # if weight not specified, default to 1
                                    correct_weight += 1
                            time.sleep(0.5) #sleep 1 sec between request 
                            break # continue to next input_x file

        except Exception as e:
            traceback.print_exc()
            response_data = {
                "error": "Something went wrong!",
                "status" : status.HTTP_500_INTERNAL_SERVER_ERROR
            }
            return response_data
        if correct_count == total_test:
            submission.status = settings.SUBMISSION_STATUS_CORRECT
        else:
            submission.status = settings.SUBMISSION_STATUS_INCORRECT
        submission.score = float(correct_weight) / float(total_weight) * 10
        print(correct_weight)
        print(total_weight)

        if(submission.date > submission.assignment.due_date):
            submission.status = settings.SUBMISSION_STATUS_OVERDUE
        submission.save()
        response_data = {
            "message" : "Submit Succeeded!",
            "correct_count": correct_count,
            "total_test": total_test,
            "code_outputs": infos,
            "status" : status.HTTP_200_OK
        }
        return response_data
    def get_serializer_class(self):
        if self.action in [SubmissionViewSetAction.list.value, SubmissionViewSetAction.retrieve.value]:
            return SubmissionRepresentSerializer

        return SubmissionSerializer
    
    #return logged in user's submissions, or if user's admin, show all
    def get_queryset(self):
        if is_teacher(self.request.user):
            return Submission.objects.exclude(is_deleted=True, user__is_active=False).order_by('-date','pk')
        return Submission.objects.filter(user=self.request.user).exclude(is_deleted=True).order_by('-date','pk')
    
    #return chosen submission 
    def retrieve(self, request, pk, *args, **kwargs):
        if Submission.objects.filter(pk=pk).count() < 1:
            return Response({"message": "Submission Doesn't Exist!"}, status=status.HTTP_404_NOT_FOUND)
        submission = Submission.objects.get(pk=pk)
        if submission.user != request.user and not is_teacher(request.user):
            return Response({
                "message": "Access Denied!",
                }, status=status.HTTP_401_UNAUTHORIZED)
        return Response({
            "submission" : SubmissionRepresentSerializer(submission).data,
        }, status=status.HTTP_200_OK)

    #create new submission
    def create(self, request, *args, **kwargs):
        #get submission data
        #user = request.user #get current user
        file_name = ''
        if request.data.get('file_name', None) is not None and request.data.get('file_name', None).strip() != '':
            file_name = request.data.get('file_name', None)
        
        # request body eg:
        # {
        #     "content": "num1=int(input(' '))\nnum2=int(input(' '))\nprint (num1 + num2)",
        #     "lang": "python2",
        #     "assignment": "PY201Demo"
        # }
        # lang = jdoodle supported language code. 
        # https://docs.jdoodle.com/integrating-compiler-ide-to-your-application/languages-and-versions-supported-in-api-and-plugins
        serializer = SubmissionPostSerializer(data=request.data, context={'request': request})
        
        if not serializer.is_valid():
            return Response({
                serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        #check if user have permission to submit
        assignment_code=serializer.data['assignment']
        in_class=serializer.data['in_class']
        if Assignment.objects.filter(assignment_code=assignment_code, in_class__code=in_class).count() == 0:
            return Response({"message": "Assignment Doesn't Exist!"},
                           status=status.HTTP_404_NOT_FOUND)
        assignment = Assignment.objects.get(assignment_code=assignment_code, in_class__code=in_class)
        if not self.has_submit_permission(request, assignment):
            return Response({"message": "You Are Not Permitted to Submit to This Assignment!"},
                           status=status.HTTP_401_UNAUTHORIZED)
        
        if not self.check_lang(lang=serializer.data.get('lang', ""), assignment=assignment):
            return Response({'message': "Pick assignment's allowed language!"},
                            status=status.HTTP_409_CONFLICT)
        #create & save submission object

        #get language supported version index by language code 
        version_index = settings.LANG_VERSION_INDEX_JDOODLE.get(serializer.data.get('lang', ""), None)
        if version_index is None:
            return Response({"message": "This language is not supported!"}, status=status.HTTP_409_CONFLICT)
        
        submission = serializer.save()
        #call JDOODLE
       
        response_data = self.process_submission(submission, version_index)
        process_status = response_data.pop('status')
        response_data['file_name'] = file_name
        #send back result containing number of valid test done & number of valid test correct
        return Response(response_data, status=process_status)
    
    # url_path uses regex instead of similar to django.urls.path()
    # url_path="path/path/.../(?P<para_name>[^/.]+)/(?P<para_name>[^/.]+)"
    # instead of
    # "path/path/.../<int:para_name>/<str:para_name>/<str:para_name>" 
    # if details = True, pk is self-gen, /submissions/(pk)/checker
    # if details = False,                /submissions/checker
    # unless                   url_path="?P<id>[^/.]+)/checker"
    @action(methods=["GET"], detail=True, url_path="checker", url_name=SubmissionViewSetAction.check.value)
    def check(self, request, pk, *args, **kwargs):
        #set similarity threshold
        threshold = settings.FUZZY_THRESHOLD
        # or pk = self.kwargs['pk'] if pk is not declared implicitly
        try:
            submission = Submission.objects.get(pk=pk)
            version_index = settings.LANG_VERSION_INDEX_JDOODLE.get(submission.lang, None)
            if version_index:
                self.process_submission(submission, version_index)
            #filter submission with assignment.assignment_code = ..., excluding submisison pk = pk 
            #exclude().exclude() results in OR, not AND
            #exclude(,,) results in AND
            list = Submission.objects.exclude(user=submission.user).exclude(is_deleted=True)

            dict_list = []
            # get id & content of submissions to dict list then check similarity
            for i in list:
                item = {"id": i.id, "content": i.content}
                dict_list.append(item)

            # if user is staff or teacher, return all content
            #otherwise, show students only similarty rating
            show_all = is_teacher(request.user)
            query = submission.content
            scores = []
            for item in dict_list:
                check_str = item.get('content')
                ratio = fuzz.ratio(query, check_str)
                scores.append({ "id": item.get('id'), 
                            "content": item.get('content') if show_all else "",
                            "score": ratio
                            })

            #filter by threshold then sort descending
            filtered_scores = [item for item in scores if item['score'] >= threshold]
            sorted_filtered_scores = sorted(filtered_scores, key = lambda k: k['score'], reverse=True)
            sorted_filtered_scores = sorted_filtered_scores[0 : 5]
            return Response({
                "similarity": sorted_filtered_scores
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

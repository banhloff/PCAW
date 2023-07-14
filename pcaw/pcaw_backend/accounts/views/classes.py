from rest_framework import status, viewsets, generics, permissions
from permissions.permissions import ClassPermission, ClassViewSetAction
from accounts.models.classes import Class, Subject
from accounts.serializers.classes import ClassSerializer, SubjectSerializer, ClassEnrollSerializer,\
                                        ClassRepresentSerializer
from accounts.serializers.accounts import UserSerializer, UserRepresentSerializer
from assignments.models.assignments import Assignment
from assignments.serializers.assignments import AssignmentRepresentSerializer, AssignmentSerializer
from assignments.serializers.submissions import SubmissionSerializer
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from utils.serializers.utils import FileSerializer
import pandas as pd
from utils.utils import is_student, is_enrolled, is_teacher
from django.contrib.auth.models import User, Group
from django.conf import settings
import io
from utils.mail_utils import send_enroll_notification
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from pcaw_backend.pipeline import assign_permission_group, create_profile
from assignments.models.langs import Lang
import uuid
import random
import string
PARAM_SEMESTER = 'semester'
PARAM_SUBJECT = 'subject'
PARAM_CODE = 'code'
PARAM_PAGING = 'paging'
class ClassViewSet(viewsets.ModelViewSet):
    # serializer_class = ClassSerializer
    queryset = Class.objects.all().order_by('pk')
    permission_classes = (ClassPermission, )
    parser_classes = (MultiPartParser, FormParser, JSONParser, )
    pagination_class = PageNumberPagination
    pagination_class.page_size = 8
    def get_serializer_class(self):
        if self.action in [ClassViewSetAction.list.value, ClassViewSetAction.retrieve.value]:
            return ClassRepresentSerializer
        return ClassSerializer
    # override default list, retrieve, update, destroy, etc. or add custom as needed
    # e.g: views/submissions.py

    # todo as needed
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)
    # todo as needed
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)
    
    #api/classes?semeter=...&subject=...
    def list(self, request, *args, **kwargs):
        semester_str = self.request.query_params.get(PARAM_SEMESTER)
        subject_str = self.request.query_params.get(PARAM_SUBJECT)
        class_str = self.request.query_params.get(PARAM_CODE)
        
        q= Q(is_deleted=False)
        if semester_str is not None and semester_str.strip() != "":
            q &= Q(semester__name__icontains=semester_str)
        if subject_str is not None and subject_str.strip() != "":
            q &= Q(subject__subject_code__icontains=subject_str)
        if class_str is not None and class_str.strip() != "":
            q &= Q(code__icontains=class_str)
        list = Class.objects.filter(q).order_by('pk')
        paging_str = self.request.query_params.get(PARAM_PAGING)
        if paging_str is not None and paging_str.strip().lower() == 'false':
            return Response({"classes": ClassRepresentSerializer(list, many=True).data, 
            }, status=status.HTTP_200_OK)
        page = self.paginate_queryset(list)
        if page is not None:
            serializer = ClassRepresentSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        return Response({"classes": ClassRepresentSerializer(list, many=True).data, 
            }, status=status.HTTP_200_OK)
    
    @action(methods=["GET"], detail=False, url_path="yours", url_name=ClassViewSetAction.yours.value)
    def yours(self, request, *args, **kwargs):
        if is_teacher(request.user):
            list = request.user.teaches_classes.exclude(is_deleted=True).order_by('pk')
        elif is_student(request.user):
            list = request.user.studies_classes.exclude(is_deleted=True).order_by('pk')
        paging_str = self.request.query_params.get(PARAM_PAGING)
        if paging_str is not None and paging_str.strip().lower() == 'false':
            return Response({"classes": ClassRepresentSerializer(list, many=True).data, 
            }, status=status.HTTP_200_OK)
        page = self.paginate_queryset(list)
        if page is not None:
            serializer = ClassRepresentSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        return Response({"classes": ClassRepresentSerializer(list, many=True).data, 
            }, status=status.HTTP_200_OK)
    
    def process_record(self, current_class, row):
        student_email = row.get('email',None)
        if student_email is None or student_email.strip() == '':
            return
        if User.objects.filter(email=student_email).count() > 0:
            student = User.objects.get(email=student_email)
            current_class.enroll(student)
            send_enroll_notification(student, current_class)
        # if student doesn't exist yet
        else:
            username=student_email.upper().split('@')[0]
            if User.objects.filter(username=username).count() > 0:
                username = username + "_" + ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(8))
            first_name = row.get('first_name', '')
            last_name = row.get('last_name', '')
            if first_name == '' and last_name == '':
                first_name = username
            student = User(email=student_email, username=username,
                                          first_name=first_name, last_name=last_name)
            student.save()
            assign_permission_group(student)
            create_profile(student)
            current_class.enroll(student)
            student.save()
            send_enroll_notification(student, current_class)
        return

    @action(methods=["POST"], detail=True, url_path="import", url_name=ClassViewSetAction.importing.value)
    def importing(self, request, pk, *args, **kwargs):
        """Upload the CSV file.
        Then reads it and saves csv data to database.
        Endpoint: /api/classes/(id)/import
        
        csv columns (first_name, last_name, email)
        """
        
        request.data['owner'] = request.user.id
        current_class = Class.objects.get(pk=pk)
        file_serializer = FileSerializer(data=request.data)
        
        _dict_file_obj = request.data['file'].__dict__

        _csv = _dict_file_obj['_name'].endswith('.csv')

        _excel = _dict_file_obj['_name'].endswith('.xlsx')

        if request.data['file'] is None:
            return Response({"error": "No File Found"},
                            status=status.HTTP_400_BAD_REQUEST)

        if file_serializer.is_valid():
            data = self.request.data.get('file')

            if _csv is True:
                data_set = data.read().decode('UTF-8')
                io_string = io.StringIO(data_set)
                io_string = io.StringIO(data_set)

                csv_file = pd.read_csv(io_string, low_memory=False)
                columns = list(csv_file.columns.values)

                first_name, last_name, email = columns[0], columns[1],\
                    columns[2]

                for index, row in csv_file.iterrows():
                    self.process_record(current_class, row)
                        
            elif _excel is True:
                xl = pd.read_excel(data)
                columns = list(xl.columns.values)
                first_name, last_name, email = columns[0], columns[1],\
                    columns[2]
                for index, row in xl.iterrows():
                    self.process_record(current_class, row)
                        
            else:
                return Response(data={"err": "Must be *.xlsx or *.csv File."},
                                status=status.HTTP_400_BAD_REQUEST
                                )
            # file_serializer.save()
            return Response(
                {"message": "Upload Successfull"}, status=status.HTTP_200_OK)
        else:
            return Response(file_serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST
                            )
    
    @action(methods=["POST"], detail=True, url_path="enroll", url_name=ClassViewSetAction.enroll.value)
    def enroll(self, request, pk, *args, **kwargs):
        serializer = ClassEnrollSerializer(data=request.data)
        if Class.objects.filter(pk=pk).exclude(is_deleted=True).count() == 0:
            return Response({"message": "Class Does Not Exists"},
                        status=status.HTTP_404_NOT_FOUND)
        if Class.objects.filter(pk=pk).exclude(is_deleted=True).count() > 0 and serializer.is_valid():
            enroll_class = Class.objects.get(pk=pk)
            if enroll_class in request.user.studies_classes.all():
                return Response({"message": "You Are Already In Class!"},
                                status=status.HTTP_409_CONFLICT)
            if not enroll_class.is_open:
                return Response({"message": "Class Is Closed!"},
                                status=status.HTTP_409_CONFLICT)
            if enroll_class.students.all().count() >= settings.CLASS_SIZE:
                return Response({"message": "Class Is Full!"},
                                status=status.HTTP_409_CONFLICT)
            if enroll_class.enroll_code == serializer.data.get('enroll_code'):
                enroll_class.enroll(request.user)
                return Response({"message": "Enroll Succeeded!"}, 
                        status=status.HTTP_200_OK)
            else:
                return Response({"message": "Wrong Enroll Code!"}, 
                        status=status.HTTP_409_CONFLICT)
        return Response({"message": "Enroll Failed!"},
                        status=status.HTTP_409_CONFLICT)

    @action(methods=["POST"], detail=True, url_path="unenroll", url_name=ClassViewSetAction.unenroll.value)
    def unenroll(self, request, pk, *args, **kwargs):
        if Class.objects.filter(pk=pk).count() > 0:
            unenroll_class = Class.objects.get(pk=pk)
            if not unenroll_class in request.user.studies_classes.all():
                return Response({"message": "You Are Not In Class!"},
                                status=status.HTTP_409_CONFLICT)
            if unenroll_class.unenroll(request.user) == request.user:
                return Response({"message": "UnEnroll Succeeded!"}, 
                        status=status.HTTP_200_OK)
        return Response({"message": "UnEnroll Failed!"},
                        status=status.HTTP_404_NOT_FOUND)

    @action(methods=["GET"], detail=True, url_path="students", url_name=ClassViewSetAction.students.value)
    def students(self, request, pk, *args, **kwargs):
        if Class.objects.filter(pk=pk).count() > 0:
            _class = Class.objects.get(pk=pk)
            students = UserRepresentSerializer(_class.students.exclude(is_active=False), many=True)
            return Response({"students": students.data},
                            status=status.HTTP_200_OK)
        return Response({"message": "Class Does Not Exist"},
                        status=status.HTTP_404_NOT_FOUND)

    @action(methods=["GET"], detail=True, url_path="assignments", url_name=ClassViewSetAction.assignments.value)
    def assignments(self, request, pk, *args, **kwargs):
        if Class.objects.filter(pk=pk).count() > 0:
            resp = []
            assignments = Assignment.objects.filter(in_class__pk=pk).exclude(is_deleted=True)
            is_status_sent =  is_student(request.user)
            submissions = request.user.submissions.filter(assignment__in=assignments).exclude(is_deleted=True)
            
            for a in assignments.all():
                submitted = False
                for s in submissions.all():
                    if s.assignment == a:
                        assignment = AssignmentRepresentSerializer(a, many=False).data
                        if is_status_sent:
                            assignment.pop('io_file')
                        resp.append({"assignment": assignment,
                                    "status": s.status if is_status_sent else "",
                                    "date": s.date.strftime(settings.DATETIME_FORMAT) if is_status_sent else ""})
                        submitted = True
                if not submitted:
                    resp.append({"assignment": AssignmentRepresentSerializer(a, many=False).data,
                                "status": "",
                                "date":""})
            return Response({"assignments": resp},
                            status=status.HTTP_200_OK)
        return Response({"message": "Class Does Not Exist"},
                        status=status.HTTP_404_NOT_FOUND)
    
    @action(methods=["GET"], detail=True, url_path="students/(?P<student_id>[0-9]+)", url_name=ClassViewSetAction.submissions_by_student.value)
    def submissions_by_student(self, request, pk, student_id, *args, **kwargs):
        if Class.objects.filter(pk=pk).exclude(is_deleted=True).count() > 0:
            _class = Class.objects.get(pk=pk)
            if User.objects.filter(pk=student_id).exclude(is_active=False).count() < 1:
                return Response({"message": "Student Does Not Exist"},
                        status=status.HTTP_404_NOT_FOUND)
            student = User.objects.get(pk=student_id)
            if student not in _class.students.all():
                return Response({"message": "Student Is Not In Class"},
                        status=status.HTTP_404_NOT_FOUND)
            
            assignments = Assignment.objects.filter(in_class=_class).exclude(is_deleted=True)
            submissions = student.submissions.filter(assignment__in=assignments).exclude(is_deleted=True)
            resp = []
            for a in assignments.all():
                submitted = False
                for s in submissions.all():
                    if s.assignment == a:
                        resp.append({"assignment": AssignmentSerializer(a, many=False).data,
                                    "submission": SubmissionSerializer(s, many=False).data})
                        submitted = True
                if not submitted:
                    resp.append({"assignment": AssignmentSerializer(a, many=False).data,
                                "submission": ""})
            return Response({"assignments": resp},
                            status=status.HTTP_200_OK)
        return Response({"message": "Class Does Not Exist"},
                        status=status.HTTP_404_NOT_FOUND)

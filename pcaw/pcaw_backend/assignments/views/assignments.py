from assignments.serializers.assignments import AssignmentSerializer, AssignmentRepresentSerializer
from assignments.serializers.submissions import SubmissionRepresentSerializer, SubmissionSerializer
from rest_framework import status, viewsets, generics, permissions
from permissions.permissions import AssignmentPermission, AssignmentViewSetAction
from assignments.models.assignments import Assignment
from assignments.models.submissions import Submission
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Prefetch
from utils.utils import is_teacher, is_enrolled, is_student, is_instructor
PARAM_PAGING = 'paging'
class AssignmentViewSet(viewsets.ModelViewSet):
    # serializer_class = AssignmentSerializer
    permission_classes =  (AssignmentPermission,)
    queryset = Assignment.objects.exclude(is_deleted=True).all().order_by('-due_date', 'pk')
    parser_classes = (MultiPartParser, FormParser,JSONParser, )
    # override default list, retrieve, update, destroy, etc. or add custom as needed
    # e.g: views/submissions.py
    def list(self, request, *args, **kwargs):
        paging_str = self.request.query_params.get(PARAM_PAGING)
        if paging_str is not None and paging_str.strip().lower() == 'false':
            return Response({"assignments": AssignmentRepresentSerializer(self.queryset, many=True).data},
                            status=status.HTTP_200_OK)
        list = self.queryset
        page = self.paginate_queryset(list)
        if page is not None:
            serializer = AssignmentRepresentSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        return Response({"assignments": AssignmentRepresentSerializer(self.queryset, many=True).data},
                            status=status.HTTP_200_OK)
    def get_serializer_class(self):
        if self.action in [AssignmentViewSetAction.list.value, AssignmentViewSetAction.retrieve.value, 
                           AssignmentViewSetAction.your_assignments.value]:
            return AssignmentRepresentSerializer

        return AssignmentSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data, many=False)
        file_name = ''
        if request.data.get('io_file', "") == "":
            pass
        else:
            _dict_file_obj = request.data['io_file'].__dict__
            file_name = _dict_file_obj['_name']
        if not serializer.is_valid():
            return Response({"message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        # add default langs if no info
        assignment = serializer.save()
        assignment.is_open=True
        assignment.is_deleted =False
        assignment.save()
        if request.data.get('langs', None) is None and \
            assignment.in_class.langs.all().count() > 0:
                for lang in assignment.in_class.langs.all():
                    assignment.langs.add(lang)
                    assignment.save()
        return Response({"message": "Create Succeeded!",
                         "file_name": file_name,
                         "assignment": self.get_serializer(assignment, many=False).data}, status=status.HTTP_200_OK)

    @action(methods=["GET"], detail=False, url_path="yours", url_name=AssignmentViewSetAction.your_assignments.value)
    def your_assignments(self, request, *args, **kwargs):
        classes = self.request.user.studies_classes.exclude(is_deleted=True).all()
        # 'forward filter' instead of 'reverse related' ...user.studies_classes.assignments, 
        # since each class in studies_classes would call DB for its assignments
        # alternatively, 
        # pf = Prefetch("classes", queryset = classes)
        # Assignment.objects.prefetch(pf).all()
        assignments = Assignment.objects.filter(in_class__in=classes).exclude(is_deleted=True).order_by('-due_date')
        submissions = Submission.objects.filter(user=request.user).exclude(is_deleted=True).order_by('-assignment__due_date')
        # order by due_date desc
        assignments = self.get_serializer(assignments, many=True).data
        if is_student(request.user):
            for a in assignments:
                a.pop('io_file')
        submissions = SubmissionRepresentSerializer(submissions, many=True).data
        for s in submissions:
            s.pop('assignment')
        return Response({
            "assignments": assignments,
            "submissions": submissions}, 
            status=status.HTTP_200_OK)
    
    @action(methods=["GET"], detail=True, url_path="submissions", url_name=AssignmentViewSetAction.submissions.value)
    def submissions(self, request, pk, *args, **kwargs):
        assignment = Assignment.objects.get(pk=pk)
        students = assignment.in_class.students.all()
        submissions = assignment.submissions.filter(user__in=students).exclude(is_deleted=True)
        submissions = SubmissionRepresentSerializer(submissions, many=True).data
        for s in submissions:
            s.pop('assignment')
        return Response({
            "submissions": submissions
        }, status=status.HTTP_200_OK)

    def retrieve(self, request, pk, *args, **kwargs):
        assignment = Assignment.objects.get(pk=pk)
        submissions = ""
        if not is_teacher(request.user):
            # obscure io_file if user = student
            submissions = assignment.submissions.filter(user=request.user).exclude(is_deleted=True)
            assignment = self.get_serializer(assignment).data
            assignment.pop('io_file', None)
            if submissions.count() > 0:
                submissions = SubmissionRepresentSerializer(submissions, many=True).data
        else:
            submissions = Assignment.objects.get(pk=pk).submissions.exclude(is_deleted=True)
            submissions = SubmissionRepresentSerializer(submissions, many=True).data
            assignment = self.get_serializer(assignment).data
        for s in submissions:
            s.pop('assignment', None)
        return Response({"assignment": assignment,
                        "submissions": submissions
                        }, status=status.HTTP_200_OK)

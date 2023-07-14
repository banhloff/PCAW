from assignments.serializers.assignments import AssignmentSerializer, AssignmentRepresentSerializer
from assignments.serializers.submissions import SubmissionRepresentSerializer, SubmissionSerializer
from rest_framework import status, viewsets, generics, permissions
from permissions.permissions import LangPermission, LangViewSetAction
from assignments.models.assignments import Assignment
from assignments.models.langs import Lang
from assignments.models.submissions import Submission
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Prefetch
from utils.utils import is_teacher, is_enrolled, is_student, is_instructor

class LangViewSet(viewsets.ModelViewSet):
    # serializer_class = AssignmentSerializer
    permission_classes =  (LangPermission,)
    queryset = Lang.objects.exclude(is_deleted=True).all().order_by('pk')
    parser_classes = (MultiPartParser, FormParser,JSONParser, )

    def get_serializer_class(self):
        if self.action in [LangViewSetAction.list.value, LangViewSetAction.retrieve.value,]:
            return AssignmentRepresentSerializer

        return AssignmentSerializer
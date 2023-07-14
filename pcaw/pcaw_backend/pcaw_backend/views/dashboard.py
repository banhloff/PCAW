from django.contrib.auth.models import User, Group
#from accounts.models import UserProfile
from django.contrib.auth.tokens import default_token_generator
from rest_framework.response import Response
from accounts.serializers.accounts import UserSerializer,  UserRepresentSerializer, GroupSerializer
from assignments.models.submissions import Submission
from assignments.models.assignments import Assignment
from rest_framework import status, viewsets, generics, permissions
from permissions.permissions import IsStaff
from rest_framework.decorators import action
from django.conf import settings
from rest_framework.views import APIView
from knox.models import AuthToken
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode  
from django.utils.encoding import force_bytes, force_str  
from django.db.models import Q
from accounts.models.classes import Class, Subject, Semester
from utils.utils import is_teacher
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.utils.timezone import now

ORDER_CURRENT_FIRST = "current_first"
ORDER_CURRENT_LAST = "current_last"
current_month = now().month
current_year = now().year
last_year = current_year - 1
class DashBoardView(APIView):
    permission_classes = [IsStaff, ]
    parser_classes = (MultiPartParser, FormParser, JSONParser, )

    def get_user_data(self):
        users_joined_current_month = User.objects.filter(date_joined__month=current_month, 
                                                         date_joined__year=current_year).count()
        if current_month == 2:
            users_joined_last_month = User.objects.filter(date_joined__month=1, 
                                                          date_joined__year=current_year).count()
            users_joined_two_month_prior = User.objects.filter(date_joined__month=12, 
                                                               date_joined__year=last_year).count()
        elif current_month == 1:
            users_joined_last_month = User.objects.filter(date_joined__month=12, 
                                                        date_joined__year=last_year).count()
            users_joined_two_month_prior = User.objects.filter(date_joined__month=11, 
                                                            date_joined__year=last_year).count()
        else:
            users_joined_last_month = User.objects.filter(date_joined__month=(current_month - 1), 
                                                        date_joined__year=current_year).count()
            users_joined_two_month_prior = User.objects.filter(date_joined__month=(current_month - 2), 
                                                            date_joined__year=current_year).count()
        return [users_joined_current_month, users_joined_last_month, users_joined_two_month_prior]
    
    def get_submission_data(self):
        submissions_created_current_month = Submission.objects.filter(date__month=current_month,
                                                                      date__year=current_year).count()
        if current_month == 2:
            submissions_created_last_month = Submission.objects.filter(date__month=1,
                                                                      date__year=current_year).count()
            submissions_created_two_month_prior = Submission.objects.filter(date__month=12,
                                                                      date__year=last_year).count()
        elif current_month == 1:
            submissions_created_last_month = Submission.objects.filter(date__month=12,
                                                                      date__year=last_year).count()
            submissions_created_two_month_prior = Submission.objects.filter(date__month=11,
                                                                      date__year=last_year).count()
        else:
            submissions_created_last_month = Submission.objects.filter(date__month=(current_month - 1),
                                                                      date__year=current_year).count()
            submissions_created_two_month_prior = Submission.objects.filter(date__month=(current_month - 2),
                                                                      date__year=current_year).count()
        return [submissions_created_current_month,
                 submissions_created_last_month,
                 submissions_created_two_month_prior]
    
    def get_assignment_data(self):
        assignments_started_current_month = Assignment.objects.filter(start_date__month=current_month,
                                                                      start_date__year=current_year).count()
        if current_month == 2:
            assignments_started_last_month = Assignment.objects.filter(start_date__month=1,
                                                                      start_date__year=current_year).count()
            assignments_started_two_month_prior = Assignment.objects.filter(date__month=12,
                                                                      start_date__year=last_year).count()
        elif current_month == 1:
            assignments_started_last_month = Assignment.objects.filter(start_date__month=12,
                                                                      start_date__year=last_year).count()
            assignments_started_two_month_prior = Assignment.objects.filter(start_date__month=11,
                                                                      start_date__year=last_year).count()
        else:
            assignments_started_last_month = Assignment.objects.filter(start_date__month=(current_month - 1),
                                                                      start_date__year=current_year).count()
            assignments_started_two_month_prior = Assignment.objects.filter(start_date__month=(current_month - 2),
                                                                      start_date__year=current_year).count()
        return [assignments_started_current_month,
                 assignments_started_last_month,
                 assignments_started_two_month_prior]
    
    def get(self, request, *args, **kwargs):
        
        user_data = self.get_user_data()
        submission_data = self.get_submission_data()
        assignment_data = self.get_assignment_data()
        response_data = {"order": ORDER_CURRENT_FIRST,
                        "user_data": user_data,
                        "submission_data": submission_data,
                        "assignment_data": assignment_data}
        return Response(response_data, status=status.HTTP_200_OK)
from django.contrib.auth.models import User, Group
#from accounts.models import UserProfile
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.tokens import default_token_generator
from rest_framework.response import Response
from accounts.serializers.accounts import UserSerializer, \
                                        RegisterSerializer, UserSerializer, \
                                        KnoxLoginUserSerializer, ChangePasswordSerializer,\
                                        UserRepresentSerializer, GroupSerializer, \
                                        TeacherRepresentSerializer, StudentRepresentSerializer
from accounts.serializers.user_profiles import UserProfileSerializer
from rest_framework import status, viewsets, generics, permissions
from permissions.permissions import IsTeacher, UserPermission, UserViewSetAction
from rest_framework.decorators import action
from django.conf import settings
from knox.models import AuthToken
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode  
from django.utils.encoding import force_bytes, force_str  
from django.db.models import Q
from accounts.models.classes import Class, Subject, Semester
from rest_framework.pagination import PageNumberPagination
from utils.utils import is_teacher
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
import datetime
PARAM_CODE = 'code'
PARAM_SUBJECTS = 'subjects'
PARAM_CLASSES = 'classes'
PARAM_PAGING = 'paging'
PARAM_DATE_START = 'start'
PARAM_DATE_END = 'end'
FORMAT = '%Y-%m-%d'
class AccountViewSet(viewsets.ModelViewSet):
    permission_classes = (UserPermission, )
    # serializer_class = UserSerializer
    queryset = User.objects.all() 
    pagination_class = PageNumberPagination
    pagination_class.page_size = 5
    parser_classes = (MultiPartParser, FormParser, JSONParser, )
    def get_serializer_class(self):
        if self.action in [UserViewSetAction.list.value, UserViewSetAction.retrieve.value]:
            return UserRepresentSerializer

        return UserSerializer
    # override default list, retrieve, update, destroy, etc. or add custom as needed
    def list(self, request, *args, **kwargs):
        code_str = self.request.query_params.get(PARAM_CODE)
        date_start_str = self.request.query_params.get(PARAM_DATE_START)
        date_end_str = self.request.query_params.get(PARAM_DATE_END)
        
        q = Q(is_active=True)
        if date_start_str is not None and date_start_str.strip() != "":
            date_start = datetime.datetime.strptime(date_start_str, FORMAT)
            q &= Q(date_joined__gte=date_start)
        if date_end_str is not None and date_end_str.strip() != "":
            date_end = datetime.datetime.strptime(date_end_str, FORMAT)
            q &= Q(date_joined__lte=date_end)
        if code_str is not None and code_str.strip() != "":
            q &= Q(profile__code__icontains=code_str)|Q(username__icontains=code_str)
        
        list = User.objects.filter(q).order_by('pk')
        paging_str = self.request.query_params.get(PARAM_PAGING)
        if paging_str is not None and paging_str.strip().lower() == 'false':
            return Response({"users":UserRepresentSerializer(list, many=True).data},
                        status=status.HTTP_200_OK)
        page = self.paginate_queryset(list)
        if page is not None:
            serializer = UserRepresentSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        return Response({"users":UserRepresentSerializer(list, many=True).data},
                        status=status.HTTP_200_OK)

    def retrieve(self, request, pk, *args, **kwargs):
        if is_teacher(request.user):
            return Response({
                "user": self.get_serializer(User.objects.get(pk=pk)).data
                }, status=status.HTTP_200_OK)
        return Response({"user": self.get_serializer(request.user).data}, status=status.HTTP_200_OK)
    
    def update(self, request, pk, *args, **kwargs):
        update_user = User.objects.get(pk=pk)
        modified_data = request.data.copy()
        # only teacher or staff can edit these directly
        if not is_teacher(request.user):
            if modified_data.get('teaches_subjects', None):
                modified_data.pop('teaches_subjects')
            if modified_data.get('teaches_classes', None):
                modified_data.pop('teaches_classess')
            if modified_data.get('studies_subjects', None):
                modified_data.pop('studies_subjects')
            if modified_data.get('studies_classes', None):
                modified_data.pop('studies_classes')
        # only staff can edit these fields
        if not request.user.is_staff:
            modified_data['is_active'] = update_user.is_active
            if modified_data.get('groups', None):
                modified_data.pop('groups')
        if not request.user.is_superuser:
            modified_data['is_staff'] = update_user.is_staff
            modified_data['is_superuser'] = update_user.is_superuser

        serializer = self.get_serializer(update_user, modified_data, partial = True)
        if not serializer.is_valid():
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response({
                "message":"Update Succeeded",
                "user": UserRepresentSerializer(update_user).data
            }, status=status.HTTP_200_OK)
    
    def partial_update(self, request, pk, *args, **kwargs):
        update_user = User.objects.get(pk=pk)
        modified_data = request.data.copy()
        # only teacher or staff can edit these directly
        if not is_teacher(request.user):
            if modified_data.get('teaches_subjects', None):
                modified_data.pop('teaches_subjects')
            if modified_data.get('teaches_classes', None):
                modified_data.pop('teaches_classess')
            if modified_data.get('studies_subjects', None):
                modified_data.pop('studies_subjects')
            if modified_data.get('studies_classes', None):
                modified_data.pop('studies_classes')
        # only staff can edit these fields
        if not request.user.is_staff:
            modified_data['is_active'] = update_user.is_active
            if modified_data.get('groups', None):
                modified_data.pop('groups')
        if not request.user.is_superuser:
            modified_data['is_staff'] = update_user.is_staff
            modified_data['is_superuser'] = update_user.is_superuser

        serializer = self.get_serializer(update_user, modified_data, partial = True)
        if not serializer.is_valid():
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response({
                "message":"Partial Update Succeeded!",
                "user": UserRepresentSerializer(update_user).data
            }, status=status.HTTP_200_OK)
    
    #/accounts/<id>/roles
    @action(methods=["GET"], detail=True, url_path="roles", url_name=UserViewSetAction.roles.value)
    def roles(self, request, pk, *args, **kwargs): 
        if is_teacher(request.user):
            groups = User.objects.get(pk=pk).groups.all()
        else:    
            groups = User.objects.get(pk=request.user.pk).groups.all()
        return Response({"groups": GroupSerializer(groups, many=True).data}, status=status.HTTP_200_OK)
    
    #/accounts/teachers
    @action(methods=["GET"], detail=False, url_path="teachers", url_name=UserViewSetAction.list_teachers.value)
    def list_teachers(self, request, *args, **kwargs):
        code_str = self.request.query_params.get(PARAM_CODE)
        subject_list_str = self.request.query_params.get(PARAM_SUBJECTS)
        class_list_str = self.request.query_params.get(PARAM_CLASSES)
        
        date_start_str = self.request.query_params.get(PARAM_DATE_START)
        date_end_str = self.request.query_params.get(PARAM_DATE_END)
        # if using Q, can't use regular filter() alongside Q()
        # build entire Q first then use filter() only once,
        # order_by() need to follow after
        q = Q(groups__name=settings.GROUP_TEACHER)&Q(is_active=True)
        if date_start_str is not None and date_start_str.strip() != "":
            date_start = datetime.datetime.strptime(date_start_str, FORMAT)
            q &= Q(date_joined__gte=date_start)
        if date_end_str is not None and date_end_str.strip() != "":
            date_end = datetime.datetime.strptime(date_end_str, FORMAT)
            q &= Q(date_joined__lte=date_end)
        if code_str is not None and code_str.strip() != "":
            q &= Q(profile__code__icontains=code_str)|Q(username__icontains=code_str)
        if subject_list_str is not None and subject_list_str.strip() != "":
            # complex lookup
            # https://docs.djangoproject.com/en/dev/topics/db/queries/#complex-lookups-with-q-objects
            
            # filter User(Teacher) that teaches_subjects, 
            # of which subject_code (case-insensitive) contains xxx

            for code in subject_list_str.split(','):
                q &= Q(teaches_subjects__subject_code__icontains = code)
     

        if class_list_str is not None and class_list_str.strip() != "":
            # filter User(Teacher) that teaches_classes, 
            # of which code (case-insensitive) contains xxx
            for code in class_list_str.split(','):
                q &= Q(teaches_classes__code__icontains = code)
        list = User.objects.filter(q).order_by('pk')
        paging_str = self.request.query_params.get(PARAM_PAGING)
        if paging_str is not None and paging_str.strip().lower() == 'false':
            return Response({"teachers":TeacherRepresentSerializer(list, many=True).data},
                        status=status.HTTP_200_OK)
        page = self.paginate_queryset(list)
        if page is not None:
            serializer = TeacherRepresentSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        return Response({"teachers":TeacherRepresentSerializer(list, many=True).data},
                        status=status.HTTP_200_OK)
    
    #/accounts/students
    @action(methods=["GET"], detail=False, url_path="students", url_name=UserViewSetAction.list_students.value)
    def list_students(self, request, *args, **kwargs):
        code_str = self.request.query_params.get(PARAM_CODE)
        subject_list_str = self.request.query_params.get(PARAM_SUBJECTS)
        class_list_str = self.request.query_params.get(PARAM_CLASSES)
        
        date_start_str = self.request.query_params.get(PARAM_DATE_START)
        date_end_str = self.request.query_params.get(PARAM_DATE_END)
        q = Q(groups__name=settings.GROUP_STUDENT)&Q(is_active=True)
        if date_start_str is not None and date_start_str.strip() != "":
            date_start = datetime.datetime.strptime(date_start_str, FORMAT)
            q &= Q(date_joined__gte=date_start)
        if date_end_str is not None and date_end_str.strip() != "":
            date_end = datetime.datetime.strptime(date_end_str, FORMAT)
            q &= Q(date_joined__lte=date_end)
        if code_str is not None and code_str.strip() != "":
            q &= Q(profile__code__icontains=code_str)| Q(username__icontains=code_str)
        if subject_list_str is not None and subject_list_str.strip() != "":
            
            # filter User(Student) that studies_subjects, 
            # of which subject_code (case-insensitive) contains xxx
            for code in subject_list_str.split(','):
                q &= Q(studies_subjects__subject_code__icontains = code)

        if class_list_str is not None and class_list_str.strip() != "":
            # filter User(Student) that studies_classes, 
            # of which code (case-insensitive) contains xxx
            for code in class_list_str.split(','):
                q &= Q(studies_classes__code__icontains = code)
        
        list = User.objects.filter(q).order_by('pk')
        paging_str = self.request.query_params.get(PARAM_PAGING)
        if paging_str is not None and paging_str.strip().lower() == 'false':
            return Response({
            "students": StudentRepresentSerializer(list, many=True).data, 
            }, status=status.HTTP_200_OK)
        page = self.paginate_queryset(list)
        if page is not None:
            serializer = StudentRepresentSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        return Response({
            "students": StudentRepresentSerializer(list, many=True).data, 
            }, status=status.HTTP_200_OK)
    
    @action(methods=["POST"], detail=True, url_path="grant-teacher", url_name=UserViewSetAction.grant_teacher_role.value)
    def grant_teacher_role(self, request, pk, *args, **kwargs):
        if User.objects.filter(pk=pk).count() == 0:
            return Response({"message": "User Not Found"}, status=status.HTTP_404_NOT_FOUND)
        group_teacher = Group.objects.get(name=settings.GROUP_TEACHER)
        group_student = Group.objects.get(name=settings.GROUP_STUDENT)
        user = User.objects.get(pk=pk)
        user.groups.remove(group_student)
        user.groups.add(group_teacher)
        user.is_staff = False
        user.save()
        return Response({"message":"Teacher Role Granted",
                         "teacher": TeacherRepresentSerializer(user, many=False).data}, status=status.HTTP_200_OK)

    @action(methods=["POST"], detail=True, url_path="grant-student", url_name=UserViewSetAction.grant_student_role.value)
    def grant_student_role(self, request, pk, *args, **kwargs):
        if User.objects.filter(pk=pk).count() == 0:
            return Response({"message": "User Not Found"}, status=status.HTTP_404_NOT_FOUND)
        group_teacher = Group.objects.get(name=settings.GROUP_TEACHER)
        group_student = Group.objects.get(name=settings.GROUP_STUDENT)
        user = User.objects.get(pk=pk)
        user.groups.add(group_student)
        user.groups.remove(group_teacher)
        user.is_staff = False
        user.save()
        return Response({"message":"Student Role Granted",
                         "student": TeacherRepresentSerializer(user, many=False).data}, status=status.HTTP_200_OK)

# username password register
class KnoxRegistrationAPI(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if User.objects.filter(email=serializer.validated_data.get('email')).exists():
            return Response({
                "message": "Email Is Already Used!",
            }, status=status.HTTP_409_CONFLICT)
        user = serializer.save()
        
        return Response({
            "message:": "Register Succeeded! Check Email for Confirmation!",
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        }, status=status.HTTP_200_OK)

# username password login 
class KnoxLoginAPI(generics.GenericAPIView):
    serializer_class = KnoxLoginUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            "user": UserRepresentSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        }, status=status.HTTP_200_OK)

#confirm registration
class ConfirmAPI(generics.GenericAPIView):
    #arguments for get/post/...are always self, request, etc.
    def get(self, request, uidb64, token):
        try:  
            uid = force_str(urlsafe_base64_decode(uidb64))  
            user = User.objects.get(pk=uid)  
        except(TypeError, ValueError, OverflowError, User.DoesNotExist):  
            user = None  
        if user is not None and default_token_generator.check_token(user, token):  
            user.is_active = True  
            user.save()
            return Response({
                "user": UserRepresentSerializer(user, context=self.get_serializer_context()).data,
                "token": AuthToken.objects.create(user)[1]
            }, status=status.HTTP_200_OK) 
        else:  
            return Response({
                "message": "Confirmation Fail! Link is Invalid!",
            }, status=status.HTTP_404_NOT_FOUND)

class ChangePasswordAPI(generics.UpdateAPIView):
    """
    An endpoint for changing password.
    """
    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = (IsAuthenticated,)

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password 
            if not self.object.check_password(serializer.data.get("old_password")):
                if self.object.password and self.object.has_usable_password():
                    return Response({"old_password": ["Wrong password."]}, status=status.HTTP_409_CONFLICT)
            # set_password also hashes the password that the user will get
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            response = {
                'status': 'success',
                'code': status.HTTP_200_OK,
                'message': 'Password updated successfully',
            }

            return Response(response)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# return self user
class UserAPI(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = UserRepresentSerializer

    def get_object(self):
        return self.request.user

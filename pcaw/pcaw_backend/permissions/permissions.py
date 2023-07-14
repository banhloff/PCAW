from rest_framework import permissions
from django.contrib.auth.models import User, Group
from django.conf import settings
from utils.utils import is_teacher, is_enrolled, is_student, is_instructor
from enum import Enum, auto, StrEnum
class IsOwnerOrStaff(permissions.BasePermission):
    
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user or is_teacher(request.user)

class IsTeacher(permissions.BasePermission):
    def has_permission(self, request, view):
        return is_teacher(user = request.user)

class IsStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_staff

#view.action == function name instead of url path or url name 

class UserViewSetAction(StrEnum):
    list = auto()
    list_students = auto()
    list_teachers = auto()
    roles = auto()
    create = auto()
    retrieve = auto()
    update = auto()
    partial_update = auto()
    destroy = auto()
    grant_teacher_role = auto()
    grant_student_role = auto()
#permissions to UserViewSet
# List : staff/teacher only
# Create : anyone
# Retrieve : own self or staff/teacher
# Update, Partial update : own self or staff/teacher
# Destroy : staff/teacher only
class UserPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if view.action in [UserViewSetAction.list.value,  UserViewSetAction.list_students.value, 
                           UserViewSetAction.list_teachers.value,]:
            return request.user.is_authenticated and is_teacher(request.user) and request.user.is_active
        elif view.action == UserViewSetAction.create.value:
            return True
        elif view.action in [ UserViewSetAction.retrieve.value, UserViewSetAction.update.value, 
                            UserViewSetAction.partial_update.value, UserViewSetAction.destroy.value,
                            UserViewSetAction.roles.value, UserViewSetAction.grant_teacher_role.value,
                            UserViewSetAction.grant_student_role.value, ]:
            return True
        else:
            return False
                                                                                                
    def has_object_permission(self, request, view, obj):
        # Deny actions on objects if the user is not authenticated
        if not request.user.is_authenticated:
            return False

        if view.action == UserViewSetAction.retrieve.value:
            return (obj == request.user or is_teacher(request.user)) and request.user.is_active
        elif view.action in [UserViewSetAction.roles.value, 
                             UserViewSetAction.partial_update.value, UserViewSetAction.update.value]:
            return (obj == request.user or is_teacher(request.user)) and request.user.is_active
        elif view.action == UserViewSetAction.destroy.value:
            return is_teacher(request.user) and request.user.is_active
        elif view.action in [UserViewSetAction.grant_teacher_role.value, 
                             UserViewSetAction.grant_student_role.value,]:
            return request.user.is_staff and request.user.is_active
        else:
            return False

class SubmissionViewSetAction(StrEnum):
    list = auto()
    create = auto()
    retrieve = auto()
    update = auto()
    partial_update = auto()
    destroy = auto()
    check = auto()
#permissions to SubmissionViewSet
# List : staff/teacher only
# Create : anyone authenticated
# Retrieve : own self or staff/teacher
# Update, Partial update : own self or staff/teacher
# Destroy : staff/teacher only
# check: anyone authenticated (response content varies)
class SubmissionPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if view.action == SubmissionViewSetAction.list.value:
            return request.user.is_authenticated and request.user.is_active
        elif view.action == SubmissionViewSetAction.create.value:
            return request.user.is_authenticated and request.user.is_active
        elif view.action in [ SubmissionViewSetAction.retrieve.value, SubmissionViewSetAction.update.value, 
                            SubmissionViewSetAction.partial_update.value, SubmissionViewSetAction.destroy.value, 
                            SubmissionViewSetAction.check.value,]:
            return True
        else:
            return False
                                                                                                
    def has_object_permission(self, request, view, obj):
        # Deny actions on objects if the user is not authenticated
        if not request.user.is_authenticated:
            return False

        if view.action == SubmissionViewSetAction.retrieve.value:
            return (obj.user == request.user or is_teacher(request.user)) and request.user.is_active
        elif view.action in [SubmissionViewSetAction.update.value, SubmissionViewSetAction.partial_update.value]:
            return (obj.user == request.user or is_teacher(request.user)) and request.user.is_active
        elif view.action == SubmissionViewSetAction.destroy.value:
            return is_teacher(request.user) and request.user.is_active
        # custom action 
        elif view.action == SubmissionViewSetAction.check.value:
            return (obj.user == request.user or is_teacher(request.user)) and request.user.is_active
        else:
            return False

class ClassViewSetAction(StrEnum):
    list = auto()
    assignments = auto()
    yours = auto()
    create = auto()
    retrieve = auto()
    update = auto()
    partial_update = auto()
    destroy = auto()
    importing = auto()
    enroll = auto()
    unenroll = auto()
    students = auto()
    submissions_by_student = auto()
#permissions to ClassViewSet
# List : anyone authenticated
# Create : staff/teacher only
# Retrieve : anyone authenticated
# Update, Partial update : staff/teacher only
# Destroy : staff/teacher only
# import: staff/teacher only
class ClassPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if view.action in [ClassViewSetAction.list.value, ClassViewSetAction.yours.value]:
            return request.user.is_authenticated and request.user.is_active
        elif view.action == ClassViewSetAction.create.value:
            return is_teacher(request.user) and request.user.is_active
        elif view.action in [ ClassViewSetAction.retrieve.value, ClassViewSetAction.update.value, 
                            ClassViewSetAction.partial_update.value, ClassViewSetAction.destroy.value, 
                            ClassViewSetAction.importing.value, ClassViewSetAction.enroll.value,
                            ClassViewSetAction.unenroll.value, ClassViewSetAction.students.value,
                            ClassViewSetAction.assignments.value, ClassViewSetAction.submissions_by_student.value]:
            return True
        else:
            return False
                                                                                                
    def has_object_permission(self, request, view, obj):
        # Deny actions on objects if the user is not authenticated
        if not request.user.is_authenticated:
            return False
        # if authenticated
        if view.action in [ClassViewSetAction.retrieve.value, ClassViewSetAction.students.value,]:
            return (is_instructor(request.user, obj) or is_enrolled(request.user, obj)) and request.user.is_active
        elif view.action in [ClassViewSetAction.assignments.value]:
            return (is_enrolled(request.user, obj) or is_instructor(request.user, obj)) and request.user.is_active
        elif view.action in [ClassViewSetAction.update.value, ClassViewSetAction.partial_update.value, 
                            ClassViewSetAction.importing.value, ClassViewSetAction.submissions_by_student.value]:
            return (is_instructor(request.user, obj) or request.user.is_staff) and request.user.is_active
        elif view.action ==  ClassViewSetAction.destroy.value:
            return request.user.is_staff and request.user.is_active
        elif view.action in [ClassViewSetAction.enroll.value, ClassViewSetAction.unenroll.value]:
            return is_student(request.user) and request.user.is_active
        else:
            return False

class AssignmentViewSetAction(StrEnum):
    list = auto()
    submissions = auto()
    create = auto()
    retrieve = auto()
    update = auto()
    partial_update = auto()
    destroy = auto()
    your_assignments = auto()
#permissions to AssignmentViewSet
# List : anyone authenticated
# Create : staff/teacher only
# Retrieve : anyone authenticated
# Update, Partial update : staff/teacher only
# Destroy : staff/teacher only
class AssignmentPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if view.action in [AssignmentViewSetAction.your_assignments.value,]:
            return request.user.is_authenticated and request.user.is_active
        elif view.action in [AssignmentViewSetAction.list.value]:
            return is_teacher(request.user) and request.user.is_active
        elif view.action == AssignmentViewSetAction.create.value:
            return is_teacher(request.user) and request.user.is_active
        elif view.action in [AssignmentViewSetAction.retrieve.value, AssignmentViewSetAction.update.value, 
                            AssignmentViewSetAction.partial_update.value, AssignmentViewSetAction.destroy.value,
                            AssignmentViewSetAction.submissions.value]:
            return True
        else:
            return False
                                                                                                
    def has_object_permission(self, request, view, obj):
        # Deny actions on objects if the user is not authenticated
        if not request.user.is_authenticated:
            return False
        # if authenticated
        if view.action == AssignmentViewSetAction.retrieve.value:
            return True
        elif view.action in [AssignmentViewSetAction.update.value, AssignmentViewSetAction.partial_update.value, 
                             AssignmentViewSetAction.submissions.value]:
            return is_teacher(request.user) and request.user.is_active
        elif view.action ==  AssignmentViewSetAction.destroy.value:
            return is_teacher(request.user) and request.user.is_active
        else:
            return False

class SubjectViewSetAction(StrEnum):
    list = auto()
    create = auto()
    retrieve = auto()
    update = auto()
    partial_update = auto()
    destroy = auto()
#permissions to SubjectViewSet
# List : anyone authenticated
# Create : staff/teacher only
# Retrieve : anyone authenticated
# Update, Partial update : staff/teacher only
# Destroy : staff/teacher only
class SubjectPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if view.action == SubjectViewSetAction.list.value:
            return request.user.is_authenticated and request.user.is_active
        elif view.action == SubjectViewSetAction.create.value:
            return is_teacher(request.user) and request.user.is_active
        elif view.action in [ SubjectViewSetAction.retrieve.value, SubjectViewSetAction.update.value, 
                            SubjectViewSetAction.partial_update.value, SubjectViewSetAction.destroy.value]:
            return True
        else:
            return False
                                                                                                
    def has_object_permission(self, request, view, obj):
        # Deny actions on objects if the user is not authenticated
        if not request.user.is_authenticated:
            return False
        # if authenticated
        if view.action == SubjectViewSetAction.retrieve:
            return True
        elif view.action in [SubjectViewSetAction.update.value, SubjectViewSetAction.partial_update.value]:
            return is_teacher(request.user) and request.user.is_active
        elif view.action == SubjectViewSetAction.destroy.value:
            return is_teacher(request.user) and request.user.is_active
        else:
            return False

class SemesterViewSetAction(StrEnum):
    list = auto()
    create = auto()
    retrieve = auto()
    update = auto()
    partial_update = auto()
    destroy = auto()
#permissions to SemesterViewSet
# List : anyone authenticated
# Create : staff/teacher only
# Retrieve : anyone authenticated
# Update, Partial update : staff/teacher only
# Destroy : staff/teacher only
class SemesterPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if view.action == SemesterViewSetAction.list.value:
            return request.user.is_authenticated and request.user.is_active
        elif view.action == SemesterViewSetAction.create.value:
            return is_teacher(request.user) and request.user.is_active
        elif view.action in [SemesterViewSetAction.retrieve.value, SemesterViewSetAction.update.value,
                            SemesterViewSetAction.partial_update.value, SemesterViewSetAction.destroy.value]:
            return True
        else:
            return False
                                                                                                
    def has_object_permission(self, request, view, obj):
        # Deny actions on objects if the user is not authenticated
        if not request.user.is_authenticated:
            return False
        # if authenticated
        if view.action == SemesterViewSetAction.retrieve.value:
            return True
        elif view.action in [SemesterViewSetAction.update.value, SemesterViewSetAction.partial_update.value]:
            return is_teacher(request.user) and request.user.is_active
        elif view.action == SemesterViewSetAction.destroy.value:
            return is_teacher(request.user) and request.user.is_active
        else:
            return False

class LangViewSetAction(StrEnum):
    list = auto()
    create = auto()
    retrieve = auto()
    update = auto()
    partial_update = auto()
    destroy = auto()
#permissions to LangViewSet
# List : anyone authenticated
# Create : staff/teacher only
# Retrieve : anyone authenticated
# Update, Partial update : staff/teacher only
# Destroy : staff/teacher only
class LangPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if view.action == LangViewSetAction.list.value:
            return request.user.is_authenticated and request.user.is_active
        elif view.action == LangViewSetAction.create.value:
            return is_teacher(request.user) and request.user.is_active
        elif view.action in [LangViewSetAction.retrieve.value, LangViewSetAction.update.value,
                            LangViewSetAction.partial_update.value, LangViewSetAction.destroy.value]:
            return True
        else:
            return False
                                                                                                
    def has_object_permission(self, request, view, obj):
        # Deny actions on objects if the user is not authenticated
        if not request.user.is_authenticated:
            return False
        # if authenticated
        if view.action == LangViewSetAction.retrieve.value:
            return True
        elif view.action in [LangViewSetAction.update.value, LangViewSetAction.partial_update.value]:
            return is_teacher(request.user) and request.user.is_active
        elif view.action == LangViewSetAction.destroy.value:
            return is_teacher(request.user) and request.user.is_active
        else:
            return False

class UserProfileViewSetAction(StrEnum):
    list = auto()
    create = auto()
    retrieve = auto()
    update = auto()
    partial_update = auto()
    destroy = auto()
#permissions to UserProfileViewSet
# List : staff only
# Create : none
# Retrieve : anyone authenticated
# Update, Partial update : anyone authenticated
# Destroy : none
class UserProfilePermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if view.action == UserProfileViewSetAction.list.value:
            return request.user.is_staff and request.user.is_active
        elif view.action in [UserProfileViewSetAction.create.value , UserProfileViewSetAction.destroy.value]:
            return False
        elif view.action in [UserProfileViewSetAction.retrieve.value, UserProfileViewSetAction.update.value,
                            UserProfileViewSetAction.partial_update.value]:
            return True
        else:
            return False
                                                                                                
    def has_object_permission(self, request, view, obj):
        # Deny actions on objects if the user is not authenticated
        if not request.user.is_authenticated:
            return False
        # if authenticated
        if view.action == UserProfileViewSetAction.retrieve.value:
            return (obj == request.user.profile or request.user.is_staff) and request.user.is_active
        elif view.action in [UserProfileViewSetAction.update.value, UserProfileViewSetAction.partial_update.value]:
            return obj == request.user.profile or request.user.is_staff
        elif view.action == UserProfileViewSetAction.destroy.value:
            return False
        else:
            return False
from django.contrib.auth.models import User, Group
from accounts.models.classes import Class
from django.conf import settings

def is_teacher(user):
    teacher_group = Group.objects.get(name=settings.GROUP_TEACHER)
    if user.is_staff or teacher_group in user.groups.all():
        return True
    return False 

def is_student(user):
    if user.is_staff or user.is_superuser:
        return False
    student_group = Group.objects.get(name=settings.GROUP_STUDENT)
    if student_group in user.groups.all():
        return True
    return False

def is_enrolled(user, enroll_class):
    if user.studies_classes is None or user.studies_classes.count() == 0:
        return False
    return enroll_class in user.studies_classes.all()
        
def is_instructor(user, instruct_class):
    if user.teaches_classes is None or user.teaches_classes.count() == 0:
        return False
    return instruct_class in user.teaches_classes.all()
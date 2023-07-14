from django.contrib.auth.models import User, Group
from accounts.models.user_profiles import UserProfile
from django.conf import settings
import uuid
import random
import string
import re

def assign_permission_group(user, *args, **kwargs):
    teacher_group = Group.objects.get(name=settings.GROUP_TEACHER)
    student_group = Group.objects.get(name=settings.GROUP_STUDENT)

    if user.groups.all().count() > 0:
        return
    if user.email.lower().split('@')[1] in settings.STUDENT_MAIL_DOMAINS:
        user.groups.add(student_group)
    elif user.email.lower().split('@')[1] in settings.TEACHER_MAIL_DOMAINS:
        user.groups.add(teacher_group)
    else: 
        user.groups.add(student_group)
    user.save()

def create_profile(user, *args, **kwargs):
    student_group = Group.objects.get(name=settings.GROUP_STUDENT)
    pattern = re.compile(settings.STUDENT_CODE_REGEX, re.IGNORECASE)
    if UserProfile.objects.filter(user=user).count() > 0:
        return
    
    username_part = user.email.upper().split('@')[0]
    # if is student
    if student_group in user.groups.all():
        if pattern.match(username_part):
            code = pattern.match(username_part).group(1)
        else:
            code = username_part
    # if is teacher/staff
    else:
        code = username_part
    # if duplicate
    if UserProfile.objects.filter(code=code).count() > 0:
        code = code + "_" + ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(8))
    profile = UserProfile(
        user=user,
        # take 'ABCSE5555' from 'abcse5555@fpt(fe).edu.vn'
        code=code,
        bio="Describe About Yourself...")

    profile.save()


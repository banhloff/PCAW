from django.test import TestCase
from rest_framework.test import APITestCase, APIClient
from accounts.models.classes import Semester, Class
from accounts.models.user_profiles import UserProfile
import datetime
from django.core.exceptions import ValidationError
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework.test import force_authenticate
from django.urls import reverse
from rest_framework import status
from django.contrib.auth.models import Group
from pcaw_backend.pipeline import create_profile, assign_permission_group
class PipelineTestCase(TestCase):
    def setUp(self) -> None:
        fpt_user = User(id=1, username="fpt_user", email="CODECODEFPT@fpt.edu.vn")
        fe_user = User(id=2, username="fe_user", email="CODECODEFE@fe.edu.vn")
        fpt_user.save()
        fe_user.save()
        group_teacher = Group(name=settings.GROUP_TEACHER)
        group_student = Group(name=settings.GROUP_STUDENT)
        group_teacher.save()
        group_student.save()
    
    # can't rely on db
    # def test_create_profile(self):
    #     fpt_user = User.objects.get(username="fpt_user")
    #     create_profile(fpt_user)

    #     assert fpt_user.profile.code == 'CODECODEFPT'

    def test_assign_permission_group(self):
        fpt_user = User.objects.get(username="fpt_user")
        fe_user = User.objects.get(username="fe_user")
        group_student = Group.objects.get(name=settings.GROUP_STUDENT)
        group_teacher = Group.objects.get(name=settings.GROUP_TEACHER)

        assign_permission_group(fpt_user)
        assign_permission_group(fe_user)
        assert group_student in fpt_user.groups.all()
        assert group_teacher in fe_user.groups.all()



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
class AccountTestCase(TestCase):
    
    def setUp(self) -> None:
        superuser = User(username="superuser", first_name="A", 
                     last_name="B", email="AAA@fpt.edu.vn", is_staff = True, is_superuser=True)
        user = User(username="user", first_name="A", 
                    last_name="B", email="AAA1@fpt.edu.vn", is_staff = False, is_active=True)
        user_second = User(username="user_2", first_name="A", 
                    last_name="B", email="AAA2@fpt.edu.vn", is_staff = False, is_active=True)
        group_teacher = Group(name=settings.GROUP_TEACHER)
        group_student = Group(name=settings.GROUP_STUDENT)
        group_teacher.save()
        group_student.save()
        superuser.save()
        user.save()
        user_second.save()

    #retrieve request.user instead of requested pk
    def test_retrieve_as_user(self):
        client = APIClient()
        user = User.objects.get(username="user")
        client.force_authenticate(user=user)
        user_second = User.objects.get(username="user_2")
        api = '/api/accounts/' + str(user_second.pk) + '/'
        response = client.get(api)
        assert response.data["user"]["id"] == user.pk
    
    #staff is authorized to retrieve user by pk
    def test_retrieve_as_staff(self):
        client = APIClient()
        superuser = User.objects.get(username="superuser")
        client.force_authenticate(user=superuser)
        user = User.objects.get(username="user")
        api = '/api/accounts/' + str(user.pk) + '/'
        response = client.get(api)
        assert response.data["user"]["id"] == user.pk
    
    def test_retrieve_roles(self):
        client = APIClient()
        superuser = User.objects.get(username="superuser")
        client.force_authenticate(user=superuser)
        
        user = User.objects.get(username="user")
        group_teacher = Group.objects.get(name=settings.GROUP_TEACHER)
        user.groups.add(group_teacher)
        user.save()
        
        api = '/api/accounts/' + str(user.pk) + '/roles/'
        response = client.get(api)
        assert response.data["groups"][0]["name"] == settings.GROUP_TEACHER

    def test_list_teachers(self):
        client = APIClient()
        superuser = User.objects.get(username="superuser")
        client.force_authenticate(user=superuser)
        
        user = User.objects.get(username="user")
        group_teacher = Group.objects.get(name=settings.GROUP_TEACHER)
        user.groups.add(group_teacher)
        user.save()
        
        api = '/api/accounts/teachers/'
        response = client.get(api)
        assert len(response.data["results"]) == 1

    # test only superuser can change is_staff, is_active, is_superuser succeeding
    # db not persist! not working!
    # def test_partial_update_permission_level_succeed(self):
    #     client = APIClient()
    #     user = User.objects.get(username="user")
    #     api = '/api/accounts/' + str(user.pk) + '/'
    #     user.is_active = True
    #     user.is_staff = False
    #     user.is_superuser = False
    #     response = client.patch(api, 
    #                             {'is_staff': 'true', 'is_active': 'false','is_superuser':'true'},
    #                             format='json')
    #     superuser = User.objects.get(username="superuser")
    #     client.force_authenticate(user=superuser)
    #     user = User.objects.get(username="user")
    #     self.assertEqual(response.data["message"],"Partial Update Succeeded!")
    #     #self.assertEqual(response.data["user"]["is_active"], False)
    #     #self.assertEqual(response.data["user"]["is_staff"], True)
    #     #self.assertEqual(response.data["user"]["is_superuser"], True)
        
    # test only superuser can change is_staff, is_active, is_superuser failing
    # db not persist! not working!
    # def test_partial_update_permission_level_fail(self):
    #     client = APIClient()
    #     user = User.objects.get(username="user")
    #     api = '/api/accounts/' + str(user.pk) + '/'
    #     user.is_active = True
    #     user.is_staff = False
    #     user.is_superuser = False
    #     response = client.patch(api, 
    #                             {'is_staff': 'true', 'is_active': 'false','is_superuser':'true'},
    #                             format='json')
    #     superuser = User.objects.get(username="superuser")
    #     client.force_authenticate(user=user)
    #     user = User.objects.get(username="user")
    #     self.assertEqual(response.data["user"]["is_active"], True)
    #     self.assertEqual(response.data["user"]["is_staff"], False)
    #     self.assertEqual(response.data["user"]["is_superuser"], False)
from django.test import TestCase
from accounts.models.user_profiles import UserProfile
from django.contrib.auth.models import User
import datetime
from django.core.exceptions import ValidationError
from django.conf import settings
from django.utils import timezone
class SemesterTestCase(TestCase):
    def setUp(self) -> None:
        return super().setUp()
    
    def test_str(self):
        user = User.objects.create_user(username="aaaa", email="aaa@aaa.com", password="A!1111aaa")
        profile = UserProfile(user = user)
        self.assertEqual(str(profile), str(user.pk) + "_" + user.username)

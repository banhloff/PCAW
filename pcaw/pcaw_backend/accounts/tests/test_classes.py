from django.test import TestCase
from accounts.models.classes import Semester, Class
import datetime
from django.core.exceptions import ValidationError
from django.conf import settings
from django.contrib.auth.models import User
# Create your tests here.
class ClassTestCase(TestCase):
    
    def setUp(self) -> None:
        student = User(username="student111", first_name="A", last_name="B", email="AAA@fpt.edu.vn", password="AAAaaa111!")
        new_class = Class(name = "SE1515_Intro_To_Python", code = "SE1515_PY201")
        new_class.save()
        student.save()

    def test_str(self):
        new_class = Class.objects.get(code="SE1515_PY201")
        self.assertEqual(str(new_class), str(new_class.pk) + "_" + new_class.code)
        return
    
    def test_enroll(self):
        new_class = Class.objects.get(code="SE1515_PY201")
        student = User.objects.get(username="student111")
        self.assertEqual(new_class.enroll(student), student)
    
    def test_unenroll_1(self):
        new_class = Class.objects.get(code="SE1515_PY201")
        student = User.objects.get(username="student111")
        new_class.students.add(student)
        new_class.save()
        self.assertEqual(new_class.unenroll(student), student)

    def test_unenroll_2(self):
        new_class = Class.objects.get(code="SE1515_PY201")
        student = User.objects.get(username="student111")
        self.assertEqual(new_class.unenroll(student), None)
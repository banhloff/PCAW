from django.test import TestCase
from accounts.models.classes import Semester, Class
import datetime
from django.core.exceptions import ValidationError
from django.conf import settings
from django.utils import timezone
class SemesterTestCase(TestCase):
    def setUp(self) -> None:
        date_start = datetime.date.today()
        date_end = datetime.datetime.strptime('3000/12/19', settings.DATE_FORMAT)
        semester = Semester(name='SP22', date_start = date_start, date_end = date_end)
        semester.save()

    def test_str(self):
        semester = Semester.objects.get(name='SP22')
        assert str(semester) == (str(semester.pk) + "_" + semester.name)

    def test_dates(self):
        with self.assertRaises(Exception):
            date_start = datetime.date.today()
            date_end = datetime.datetime.strptime('2020/12/19', settings.DATE_FORMAT)
            semester = Semester(name='SP23', date_start = date_start, date_end = date_end)
            semester.save()
        return
    
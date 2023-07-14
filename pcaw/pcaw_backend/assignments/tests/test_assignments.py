from django.test import TestCase
from django.utils import timezone
import pytz
from assignments.models.assignments import Assignment
from accounts.models.classes import Class
import datetime
from django.core.exceptions import ValidationError
from django.conf import settings

class AssignmentTestCase(TestCase):
    def setUp(self) -> None:
        assignment = Assignment(title='test', assignment_code='test code')
            # make_aware datetime due to time zone supported DateTimeField
            # doesn't need for date (DateField)
        assignment.start_date = timezone.make_aware(datetime.datetime.now())
        due_str = '3000/09/10 00:00:30'
        assignment.due_date = timezone.make_aware(
            datetime.datetime.strptime(due_str, settings.DATETIME_FORMAT)
        )

        assignment.save()
    
    def test_str(self):
        assignment = Assignment.objects.get(assignment_code='test code')
        assert str(assignment) == str(assignment.pk) + "_" + assignment.assignment_code

    def test_dates(self):
        assignment = Assignment(title='title', assignment_code='assignment code')
        with self.assertRaises(Exception):
            # make_aware datetime due to time zone supported DateTimeField
            # doesn't need for date (DateField)
            assignment.start_date = timezone.make_aware(datetime.datetime.now())
            due_str = '2000/09/10 00:00:30'
            assignment.due_date = timezone.make_aware(
                datetime.datetime.strptime(due_str, settings.DATETIME_FORMAT)
                )

            assignment.save()
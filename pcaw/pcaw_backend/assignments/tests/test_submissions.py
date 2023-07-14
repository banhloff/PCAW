from django.test import TestCase
from django.utils import timezone
import pytz
from django.contrib.auth.models import User
from assignments.models.assignments import Assignment
from assignments.models.submissions import Submission
from accounts.models.classes import Class
import datetime
from django.core.exceptions import ValidationError
from django.conf import settings

class AssignmentTestCase(TestCase):
    def setUp(self) -> None:
        user = User(username="username", email="email@email.com")
        user.save()
        assignment = Assignment(title='test', assignment_code='test code')
            # make_aware datetime due to time zone supported DateTimeField
            # doesn't need for date (DateField)
        assignment.start_date = timezone.make_aware(datetime.datetime.now())
        due_str = '3000/09/10 00:00:30'
        assignment.due_date = timezone.make_aware(
            datetime.datetime.strptime(due_str, settings.DATETIME_FORMAT)
        )
        assignment.save()
        submission = Submission(user=user, assignment=assignment, content="content content", 
                                lang="c99", status=settings.SUBMISSION_STATUS_ACCEPTED, score=9.0)
        submission.save()
        submission_2 = Submission(user=user, assignment=assignment, content="content content 11", 
                                lang="c99", status=settings.SUBMISSION_STATUS_ACCEPTED, score=9.0)
    
    def test_str(self):
        submission = Submission.objects.get(content="content content")
                                            
        to_str = str(submission.pk) + "_" + submission.user.username + "_" + submission.assignment.assignment_code
        assert str(submission) == to_str
    
    def test_get_highest_ratio(self):
        submission = Submission.objects.get(content="content content")
        assert submission.get_highest_ratio > 70 and submission.get_highest_ratio < 100
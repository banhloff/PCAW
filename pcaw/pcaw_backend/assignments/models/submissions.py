from django.db import models
from django.contrib.auth.models import User
from accounts.models.classes import Class, Subject
from assignments.models.assignments import Assignment
from django.conf import settings
from django.db.models import F, Q
from django.core.exceptions import ValidationError
from fuzzywuzzy import fuzz, process
class Submission(models.Model):
    user = models.ForeignKey(
        User,
        related_name='submissions',
        on_delete=models.CASCADE,
    )
    content = models.TextField(default='', blank=False, null=False)
    lang = models.CharField(max_length=50,default='', blank=False, null=False)
    #UnAccepted, Accepted, Rejected, Error, Correct
    status = models.CharField(max_length=50, default=settings.SUBMISSION_STATUS_UNACCEPTED, blank=True, null=True)
    #auto update date on calling save() - create/update
    date = models.DateTimeField(auto_now=True)
    score = models.FloatField(default=0)
    assignment = models.ForeignKey(
        Assignment,
        related_name='submissions',
        on_delete=models.CASCADE,
    )
    is_deleted = models.BooleanField(default=False, null=False)
    def get_highest_ratio(self):
        list = Submission.objects.exclude(user=self.user).exclude(is_deleted=True).all()
        query = self.content
        ratios = []
        for i in list:
            ratio = fuzz.ratio(query, i.content)
            ratios.append(ratio)
        ratios.sort(reverse=True)
        return ratios[0]
    
    class Meta:
        constraints = [
            # constraint start <= due
            models.CheckConstraint(
                check=Q(score__gte=0.0) & Q(score__lte=10.0),
                name='submission_score_range'),
        ]

    def clean(self):
        if self.score > 10.0 or self.score < 0.0:
            raise ValidationError("Score out of bound [0,10]!")
    def __str__(self) -> str:
        return str(self.pk) + "_" + self.user.username + "_" + self.assignment.assignment_code
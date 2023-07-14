from django.db import models
from django.contrib.auth.models import User
from django.db.models import F, Q
from django.db.models.functions import Now
from django.core.exceptions import ValidationError
from assignments.models.langs import Lang
class Subject(models.Model):
    subject_code = models.CharField(max_length=20, unique=True, default='', null=False)
    name=models.CharField(max_length=50, default='', null=False)
    is_deleted = models.BooleanField(default=False, null=False)
    # subjects = user(teacher).teaches_subjects
    teachers = models.ManyToManyField(User, blank=True, related_name='teaches_subjects')
    # subjects = user(student).studies_subjects
    students = models.ManyToManyField(User, blank=True, related_name='studies_subjects')
    def __str__(self) -> str:
        return str(self.pk) + "_" + self.subject_code

class Semester(models.Model):
    date_start = models.DateField(null=False)
    date_end = models.DateField(null=False)
    name = models.CharField(max_length=50, default='', null=False)
    is_deleted = models.BooleanField(default=False, null=False)
    def __str__(self) -> str:
        return str(self.pk) + "_" + self.name
    
    class Meta:
        constraints = [
            # constraint start <= due
            models.CheckConstraint(
                check=Q(date_start__lte=F('date_end'),),
                name='semester_start_lte_due'
            ),
        ]

    def clean(self):
        if self.date_start > self.date_end:
            raise ValidationError("Dates are incorrect")
        
class Class(models.Model):
    name = models.CharField(max_length=50, default='', null=False)
    code = models.CharField(max_length=20, default='', unique=True, null=False)
    is_active = models.BooleanField(default=True, null=False)
    is_open = models.BooleanField(default=True, null=False)
    enroll_code = models.CharField(max_length=50, null=True)
    is_deleted = models.BooleanField(default=False, null=False)
    students = models.ManyToManyField(User, related_name='studies_classes', blank=True)
    langs = models.ManyToManyField(Lang, related_name='classes', blank=True)
    semester = models.ForeignKey(
        Semester,
        related_name="classes",
        on_delete=models.SET_NULL,
        null=True
    ) 
    instructor = models.ForeignKey(
        User,
        related_name="teaches_classes",
        on_delete=models.SET_NULL,
        null=True
    )
    subject = models.ForeignKey(
        Subject,
        related_name='classes',
        on_delete=models.SET_NULL,
        null=True)

    def __str__(self) -> str:
        return str(self.pk) + "_" + self.code

    def enroll(self, user):
        self.students.add(user)
        self.save()
        return user

    def unenroll(self, user):
        if user in self.students.all():
            self.students.remove(user)
            self.save()
            return user
        return None
from django.db import models
from django.contrib.auth.models import User
from accounts.models.classes import Class, Subject
from django.db.models import F, Q
from django.db.models.functions import Now
from utils.validators import validate_io_file
from decimal import Decimal
from django.dispatch import receiver
from assignments.models.langs import Lang
import os
from django.core.exceptions import ValidationError
from storages.backends.gcloud import GoogleCloudStorage
from django.conf import settings
from utils.storages import PrivateGCSMediaStorage
# Create your models here.
class Assignment(models.Model):

    in_class = models.ForeignKey(Class, blank=False, null=True, related_name='assignments', on_delete=models.CASCADE,) 
    
    title = models.CharField(max_length=50, blank=True, null=False)
    assignment_code = models.CharField(max_length=50, blank=False, null=False)
    description = models.TextField(default='', blank=True, null=False)
    langs = models.ManyToManyField(Lang, blank=True, related_name='assignments')
    is_open = models.BooleanField(default=True, null=False)
    start_date = models.DateTimeField(blank=False, null=True)
    due_date = models.DateTimeField(blank=False, null=True)
    is_deleted = models.BooleanField(default=False, null=False)
    def __str__(self) -> str:
        return str(self.pk) + "_" + self.assignment_code
    
    def update_filename(instance, filename):
        path = 'uploads\\assignments_io\\'
        format = instance.assignment_code + "_io.zip"
        return os.path.join(path, format)
    # file (zip) will be uploaded to MEDIA_ROOT / uploads / assignments_io / <assignment code>_io.zip
    io_file = models.FileField(upload_to =update_filename, 
                null=True, blank=True, validators=[validate_io_file], 
                storage= PrivateGCSMediaStorage)

    # <code>_io.zip
    # ------input_1.txt ------output_1.txt
    # ------input_2.txt ------output_2.txt
    class Meta:
        constraints = [
            # constraint start <= due
            models.CheckConstraint(
                check=Q(start_date__lte=F('due_date'),),
                name='assignment_start_lte_due'
            ),
        ]
        unique_together = ('in_class', 'assignment_code',)

    def clean(self):
        if self.start_date > self.due_date:
            raise ValidationError("Dates are incorrect")
        
    def get_submission_count(self):
        students = self.in_class.students.all()
        return self.submissions.filter(user__in=students)\
            .exclude(user__is_active=False, is_deleted=True).count()
# @receiver(models.signals.post_delete, sender=Assignment)
# def auto_delete_file_on_delete(sender, instance, **kwargs):
#     """
#     Deletes file from filesystem
#     when corresponding `Assignment` object is deleted.
#     """
#     if instance.io_file:
#         if os.path.isfile(instance.io_file.path):
#             os.remove(instance.io_file.path)

# @receiver(models.signals.pre_save, sender=Assignment)
# def auto_delete_file_on_change(sender, instance, **kwargs):
#     """
#     Deletes old file from filesystem
#     when corresponding `Assignment` object is updated
#     with new file.
#     """
#     if not instance.pk:
#         return False

#     try:
#         old_file = Assignment.objects.get(pk=instance.pk).io_file
#     except Assignment.DoesNotExist:
#         return False
#     if not old_file:
#         return False
#     new_file = instance.io_file
#     if not old_file == new_file:
#         if os.path.isfile(old_file.path):
#             os.remove(old_file.path)



from django.db import models
from django.contrib.auth.models import User
from django.db.models import F, Q
from django.db.models.functions import Now
from utils.validators import validate_io_file
from decimal import Decimal
from django.dispatch import receiver
import uuid
import os
from django.core.exceptions import ValidationError
from storages.backends.gcloud import GoogleCloudStorage
from django.conf import settings

class Lang(models.Model):
    name=models.CharField(max_length=50, blank=False, null=False, unique=True)
    display=models.CharField(max_length=50, blank=False, null=False, default='')
    is_deleted = models.BooleanField(default=False, null=False)
    def __str__(self) -> str:
        return str(self.pk) + "_" + self.name
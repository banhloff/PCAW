from django.db import models

class FileUpload(models.Model):
    """Represents file upload model class."""

    owner = models.CharField(max_length=250)
    file = models.FileField(upload_to ='uploads\\%y\\%m\\file_uploads\\')
    created = models.DateTimeField(auto_now_add=True)

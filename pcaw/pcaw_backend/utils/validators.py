import os
from django.core.exceptions import ValidationError
from django.conf import settings
def validate_io_file(value):
    if not value:
        return
    err = ''
    if value.size > settings.IO_FILE_LIMIT:
        err += 'File must not exceed 20MB\n'
    ext = os.path.splitext(value.name)[1]  # [0] returns path+filename
    valid_extensions = ['.zip',]
    if not ext.lower() in valid_extensions:
        err += 'Unsupported file extension (.zip)\n'
    if err:
        raise ValidationError(err)
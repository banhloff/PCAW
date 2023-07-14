# Generated by Django 4.0 on 2023-04-12 16:58

import assignments.models.assignments
from django.db import migrations, models
import utils.storages
import utils.validators


class Migration(migrations.Migration):

    dependencies = [
        ('assignments', '0004_alter_submission_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='assignment',
            name='io_file',
            field=models.FileField(blank=True, null=True, storage=utils.storages.PrivateGCSMediaStorage, upload_to=assignments.models.assignments.Assignment.update_filename, validators=[utils.validators.validate_io_file]),
        ),
    ]

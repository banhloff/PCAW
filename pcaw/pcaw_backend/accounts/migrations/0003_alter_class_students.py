# Generated by Django 4.0 on 2023-04-11 19:10

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('accounts', '0002_alter_class_students'),
    ]

    operations = [
        migrations.AlterField(
            model_name='class',
            name='students',
            field=models.ManyToManyField(blank=True, related_name='studies_classes', to=settings.AUTH_USER_MODEL),
        ),
    ]

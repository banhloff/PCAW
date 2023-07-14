# Generated by Django 4.1.6 on 2023-03-11 16:51

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='FileUpload',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('owner', models.CharField(max_length=250)),
                ('file', models.FileField(upload_to='uploads\\%y\\%m\\file_uploads\\')),
                ('created', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
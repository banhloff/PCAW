# Generated by Django 4.1.6 on 2023-03-11 16:51

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Class',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='', max_length=50)),
                ('code', models.CharField(default='', max_length=20, unique=True)),
                ('is_active', models.BooleanField(default=True)),
                ('is_open', models.BooleanField(default=True)),
                ('enroll_code', models.CharField(max_length=50, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Semester',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_start', models.DateField()),
                ('date_end', models.DateField()),
                ('name', models.CharField(default='', max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='profile', serialize=False, to=settings.AUTH_USER_MODEL)),
                ('code', models.CharField(max_length=255, null=True, unique=True)),
                ('bio', models.TextField(blank=True, default='', max_length=255, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Subject',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('subject_code', models.CharField(default='', max_length=20, unique=True)),
                ('name', models.CharField(default='', max_length=50)),
                ('students', models.ManyToManyField(blank=True, related_name='studies_subjects', to=settings.AUTH_USER_MODEL)),
                ('teachers', models.ManyToManyField(blank=True, related_name='teaches_subjects', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddConstraint(
            model_name='semester',
            constraint=models.CheckConstraint(check=models.Q(('date_start__lte', models.F('date_end'))), name='semester_start_lte_due'),
        ),
        migrations.AddField(
            model_name='class',
            name='instructor',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='teaches_classes', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='class',
            name='semester',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='classes', to='accounts.semester'),
        ),
        migrations.AddField(
            model_name='class',
            name='students',
            field=models.ManyToManyField(related_name='studies_classes', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='class',
            name='subject',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='classes', to='accounts.subject'),
        ),
    ]

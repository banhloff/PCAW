# Generated by Django 4.1.6 on 2023-04-19 16:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('assignments', '0010_alter_lang_display'),
        ('accounts', '0003_alter_class_students'),
    ]

    operations = [
        migrations.AddField(
            model_name='class',
            name='langs',
            field=models.ManyToManyField(blank=True, related_name='classes', to='assignments.lang'),
        ),
    ]

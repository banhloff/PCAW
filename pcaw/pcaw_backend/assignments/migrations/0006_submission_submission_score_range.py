# Generated by Django 4.1.6 on 2023-04-15 15:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('assignments', '0005_alter_assignment_io_file'),
    ]

    operations = [
        migrations.AddConstraint(
            model_name='submission',
            constraint=models.CheckConstraint(check=models.Q(('score__gte', 0.0), ('score__lte', 10.0)), name='submission_score_range'),
        ),
    ]

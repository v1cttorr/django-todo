# Generated by Django 5.1.5 on 2025-02-08 17:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0002_task_importance'),
    ]

    operations = [
        migrations.AddField(
            model_name='taskroom',
            name='invite_code',
            field=models.CharField(blank=True, max_length=10, unique=True),
        ),
    ]

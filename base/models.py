from django.db import models
from accounts.models import Profile

# Create your models here.
class TaskRoom(models.Model):
    title = models.CharField(max_length=100)
    users = models.ManyToManyField(Profile, related_name='rooms')

    def __str__(self):
        return self.title
    
    @property
    def get_tasks(self):
        return self.tasks.all()
    
class Task(models.Model):
    importance_choices = [
        ('trivial', 'Trivial'),
        ('important', 'Important'),
        ('high_priority', 'High Priority'),
        ('very_important', 'Very Important'),
    ]

    title = models.CharField(max_length=100)
    description = models.TextField()
    completed = models.BooleanField(default=False)
    room = models.ForeignKey(TaskRoom, on_delete=models.CASCADE, related_name='tasks')
    date = models.DateTimeField()
    importance = models.CharField(max_length=30, choices=importance_choices, default='trivial')

    def __str__(self):
        return self.title
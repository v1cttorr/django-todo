from django.db import models
from accounts.models import Profile
import uuid

# Create your models here.
class TaskRoom(models.Model):
    title = models.CharField(max_length=100)
    admin = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='admin_rooms')
    users = models.ManyToManyField(Profile, related_name='rooms')
    invite_code = models.CharField(max_length=10, unique=True, blank=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.invite_code:
            self.invite_code = str(uuid.uuid4())[:8]  # Generujemy unikalny kod (np. "abc12345")
        super().save(*args, **kwargs)

    @property
    def get_tasks(self):
        return self.tasks.all()
    
class Task(models.Model):
    IMPORTANCE_CHOICES = [
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
    importance = models.CharField(max_length=30, choices=IMPORTANCE_CHOICES, default='trivial')
    is_marked = models.BooleanField(default=False)
    background_color = models.CharField(max_length=20, default='#FFE68E')

    def save(self, *args, **kwargs):
        is_new = self.pk is None  # Check if this is a new Task
        super().save(*args, **kwargs)  # Save Task first

        if is_new:  # If it's a new Task, create a Subtask
            Subtask.objects.create(task=self, title=self.title)

    def __str__(self):
        return self.title

class Subtask(models.Model):
    title = models.CharField(max_length=100, blank=True)
    completed = models.BooleanField(default=False)
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='subtasks')

    def __str__(self):
        return self.title

class Notes(models.Model):
    # room = models.ForeignKey(TaskRoom, on_delete=models.CASCADE, related_name='notes')
    room = models.OneToOneField(TaskRoom, on_delete=models.CASCADE, related_name='notes')
    text = models.TextField()
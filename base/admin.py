from django.contrib import admin
from .models import TaskRoom, Task

# Register your models here.
admin.site.register(TaskRoom)
admin.site.register(Task)
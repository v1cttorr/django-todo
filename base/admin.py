from django.contrib import admin
from .models import TaskRoom, Task, Subtask, Notes

# Register your models here.
admin.site.register(TaskRoom)
admin.site.register(Task)
admin.site.register(Subtask)
admin.site.register(Notes)
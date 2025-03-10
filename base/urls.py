from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('create-room/', views.createRoom, name='createRoom'),
    path('room/<int:pk>/', views.room, name='room'),

    path('room/<int:pk>/add-task/', views.addTask, name='addTask'),
    path('room/<int:pk>/add-subtask/', views.addSubtask, name='addSubtask'),
    path('room/<int:pk>/get-tasks/', views.getTasks, name='getTasks'),
    path('room/<int:pk>/get-marked-tasks/', views.getMarkedTasks, name='getMarkedTasks'),
    
    path('room/<int:pk>/get-notes/', views.getNotes, name='getNotes'),
    path('room/<int:pk>/edit-notes/', views.saveNotes, name='saveNotes'),


    path('room/<int:pk>/complete-task/<int:task_pk>/<str:task_type>/', views.completeTask, name='completeTask'), #task type: task or subtask
    path('room/<int:pk>/get-completed-tasks/', views.getCompletedTasks, name='getCompletedTasksTask'),
    
    path('room/<int:pk>/remove/<int:user_pk>/', views.removeUserFromRoom, name='removeUserFromRoom'),
    
    path('join/<str:invite_code>/', views.joinRoom, name='joinRoom'),
]
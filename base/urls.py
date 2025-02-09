from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('create-room/', views.createRoom, name='createRoom'),
    path('room/<int:pk>/', views.room, name='room'),
    path('room/<int:pk>/add-task/', views.addTask, name='addTask'),
    path('room/<int:pk>/get-tasks/', views.getTasks, name='getTasks'),
    path('room/<int:pk>/complete-task/<int:task_pk>/<str:task_type>/', views.completeTask, name='completeTask'), #task type: task or subtask
    path('join/<str:invite_code>/', views.joinRoom, name='joinRoom'),
]

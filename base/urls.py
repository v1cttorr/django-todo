from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('room/<int:pk>/', views.room, name='room'),
    path('room/<int:pk>/add-task/', views.addTask, name='addTask'),
    path('room/<int:pk>/get-tasks/', views.getTasks, name='getTasks'),
    path('room/<int:pk>/complete-task/<int:task_pk>/', views.completeTask, name='completeTask'),
    path('join/<str:invite_code>/', views.joinRoom, name='joinRoom'),
]

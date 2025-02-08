from django.shortcuts import render
from .models import TaskRoom, Task
from accounts.models import Profile
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from django.http import JsonResponse


# Create your views here.
def home(request):
    try:
        user = Profile.objects.get(user=request.user)
    except:
        print('no user')


    try:
        rooms = user.rooms.all()
    except:
        rooms = None

    context = {
        'rooms': rooms,
    }

    return render(request, 'home.html', context)

@login_required(login_url='login')
def room(request, pk):
    user = Profile.objects.get(user=request.user)
    # room = user.rooms.get(id=pk)
    room = get_object_or_404(user.rooms, id=pk)
    context = {
        'room': room,
    }

    return render(request, 'room.html', context)

def addTask(request, pk):
    room = TaskRoom.objects.get(id=pk)
    title = request.POST.get('title')
    description = request.POST.get('description')
    date = request.POST.get('date')
    importance = request.POST.get('importance')

    task = Task.objects.create(
        title=title,
        description=description,
        room=room,
        date=date,
        importance=importance
    )

    return JsonResponse({'success': 'Task added successfully!'})

def getTasks(request, pk):
    room = TaskRoom.objects.get(id=pk)
    tasks = room.get_tasks
    # tasks = list(tasks.values())
    tasks_data = []
    for task in tasks:
        tasks_data.append({
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'completed': task.completed,
            'date': task.date,
            'importance': task.get_importance_display(),
        })

    return JsonResponse({'tasks': tasks_data})

def completeTask(request, pk, task_pk):
    task = Task.objects.get(id=task_pk)
    completed = True if request.POST.get('completed') == 'true' else False
    task.completed = completed
    task.save()

    return JsonResponse({'success': 'Task completed successfully!'})
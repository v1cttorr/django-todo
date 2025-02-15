from django.shortcuts import redirect, render
from .models import Subtask, TaskRoom, Task
from accounts.models import Profile
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.db.models import Case, When, Value, IntegerField


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
def createRoom(request):
    if request.method == 'POST':
        user = Profile.objects.get(user=request.user)
        title = request.POST.get('title')

        room = TaskRoom.objects.create(
            title=title,
            admin=user
        )

        room.users.add(user)

        return redirect('room', pk=room.id)
    return render(request, 'createRoom.html')

@login_required(login_url='login')
def room(request, pk):
    user = Profile.objects.get(user=request.user)
    # room = user.rooms.get(id=pk)

    room = get_object_or_404(user.rooms, id=pk)
    users = room.users.all()

    context = {
        'room': room,
        'users': users,
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

@login_required(login_url='login')
def getTasks(request, pk):
    room = TaskRoom.objects.get(id=pk)

    sort = request.GET.get('sort', 'date')
    if sort == 'null':
        sort = 'date'

    custom_order = Case(
        When(importance='trivial', then=Value(4)),
        When(importance='important', then=Value(3)),
        When(importance='high_priority', then=Value(2)),
        When(importance='very_important', then=Value(1)),
        output_field=IntegerField()
    )

    tasks = room.get_tasks.order_by(custom_order if sort == 'importance' else sort)

    tasks_data = []
    for task in tasks:
        formatted_date = task.date.strftime('%d %B %Y, %H:%M')
        tasks_data.append({
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'completed': task.completed,
            'date': formatted_date,
            'importance': task.importance#.get_importance_display(),
        })

        # subtasks_data.append(task.subtasks.all())

    subtasks_data = list((Subtask.objects.filter(task__room=room)).values())
    # print(subtasks_data)

    return JsonResponse({'tasks': tasks_data, 'subtasks': subtasks_data})

@login_required(login_url='login')
def completeTask(request, pk, task_pk, task_type):
    if task_type == 'task':
        task = Task.objects.get(id=task_pk)
    elif task_type == 'subtask':
        task = Subtask.objects.get(id=task_pk)

    # task = Task.objects.get(id=task_pk)
    task.completed = True if request.POST.get('completed') == 'true' else False
    task.save()

    return JsonResponse({'success': 'Task completed successfully!'})

def removeUserFromRoom(request, pk, user_pk):
    room = TaskRoom.objects.get(id=pk)
    user = Profile.objects.get(user=request.user)

    if room.admin != user:
        return redirect('room', pk=pk)

    userToRemove = Profile.objects.get(id=user_pk)

    room.users.remove(userToRemove)

    return redirect('room', pk=pk)

@login_required(login_url='login')
def joinRoom(request, invite_code):
    room = get_object_or_404(TaskRoom, invite_code=invite_code)
    user = Profile.objects.get(user=request.user)

    if user not in room.users.all():
        room.users.add(user)

    return redirect('room', pk=room.id)
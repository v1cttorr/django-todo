from django.shortcuts import redirect, render
from .models import Subtask, TaskRoom, Task, Notes
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
        return redirect('room', pk=rooms[0].id)
    except:
        rooms = None

    return render(request, 'home.html')

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

        notes = Notes.objects.create(
            room=room,
            text='Here you can add notes for your room!'
        )


        return redirect('room', pk=room.id)
    return render(request, 'createRoom.html')

@login_required(login_url='login')
def room(request, pk):
    user = Profile.objects.get(user=request.user)
    # room = user.rooms.get(id=pk)

    room = get_object_or_404(user.rooms, id=pk)
    users = room.users.all()
    notes = room.notes

    rooms = user.rooms.all()

    context = {
        'room': room,
        'users': users,
        'notes': notes,
        'rooms': rooms,
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

def addSubtask(request, pk):
    task = Task.objects.get(id=request.POST.get('task_id'))
    title = request.POST.get('title')

    subtask = Subtask.objects.create(
        title=title,
        task=task
    )

    return JsonResponse({'success': 'Subtask added successfully!'})

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
            'importance': task.importance,
            'importance_label': task.get_importance_display(),
            'background_color': task.background_color,
        })

        # subtasks_data.append(task.subtasks.all())

    subtasks_data = list((Subtask.objects.filter(task__room=room)).values())

    return JsonResponse({'tasks': tasks_data, 'subtasks': subtasks_data})

@login_required(login_url='login')
def completeTask(request, pk, task_pk, task_type):
    if task_type == 'task':
        task = Task.objects.get(id=task_pk)
        print('task')
    elif task_type == 'subtask':
        task = Subtask.objects.get(id=task_pk)
        print('subtask')
    
    completed = True if request.POST.get('completed') == 'true' else False

    task.completed = completed
    task.save()

    return JsonResponse({'success': 'Task completed successfully!'})

def getCompletedTasks(request, pk):
    room = TaskRoom.objects.get(id=pk)
    tasks = room.tasks.filter(completed=True).count()
    all_tasks = room.tasks.all().count()

    print('click')

    return JsonResponse({'completed_tasks': tasks, 'all_tasks': all_tasks})


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

@login_required(login_url='login')
def getMarkedTasks(request, pk):
    room = TaskRoom.objects.get(pk=pk)
    sort = request.GET.get('sort', 'date')
    marked_tasks = Task.objects.filter(room=room, isMarked=True).order_by(sort)
    return JsonResponse({'marked_tasks': list(marked_tasks.values())})

@login_required(login_url='login')
def getNotes(request, pk):
    room = TaskRoom.objects.get(pk=pk)
    notes = room.notes
    return JsonResponse({'notes': notes.text})

@login_required(login_url='login')
def saveNotes(request, pk):
    room = TaskRoom.objects.get(pk=pk)
    notes = request.POST.get('notes')
    room.notes.text = notes
    room.notes.save()
    return JsonResponse({'success': 'Notes saved successfully!'})
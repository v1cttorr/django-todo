from django.shortcuts import render
from .models import TaskRoom, Task
from accounts.models import Profile
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404

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
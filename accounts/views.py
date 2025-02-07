from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.contrib.auth import logout as auth_logout
from django.contrib.auth.decorators import login_required
from .forms import RegisterForm, ProfileForm, UserForm, LoginForm
from django.shortcuts import redirect
import os

# Create your views here.
def register(request):
    if request.method == "POST":
        form = RegisterForm(request.POST)
        if form.is_valid():
            form.save()
        
        return redirect("/login/")
    else:
        form = RegisterForm()
    
    return render(request, "accounts/register.html", {"form": form})


@login_required
def profile(request):
    path = 'media/profile_pictures'
    img_list = os.listdir(path)
    profile_picture_path = os.path.join(path, str(request.user.profile.profile_picture))
    if os.path.exists(profile_picture_path):
        img_list.append(profile_picture_path)

    context = {
        "profile": request.user.profile,
        'images': img_list,
    }

    return render(request, 'accounts/profile.html', context)


@login_required
def edit_profile(request):
    user = request.user
    profile = user.profile

    if request.method == 'POST':
        user_form = UserForm(request.POST, instance=user)
        profile_form = ProfileForm(request.POST, request.FILES, instance=profile)

        if user_form.is_valid() and profile_form.is_valid():
            user_form.save()
            profile_form.save()
            return redirect('profile')
    else:
        user_form = UserForm(instance=user)
        profile_form = ProfileForm(instance=profile)

    return render(request, 'accounts/update_profile.html', {
        'user_form': user_form,
        'profile_form': profile_form
    })
    

def login_user(request):
    if request.method == "POST":
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data["username"]
            password = form.cleaned_data["password"]
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect("/")
    else:
        form = LoginForm()
    
    return render(request, "accounts/login.html", {"form": form})


@login_required
def logout(request):
    auth_logout(request)
    return redirect('/')


def home(request):
    return redirect('/')

from .models import Profile

def setAvatar(request):
    img = request.POST['imgInfo']

    user = Profile.objects.get(user=request.user)
    user.profile_picture.name = f'{img}'
    user.save()
    return redirect('profile')
from django.db import models
from django.contrib.auth.models import User
import os
from django.db.models.signals import post_save
from django.dispatch import receiver

# Create your models here.
def get_upload_path(instance, filename):
    upload_to = 'profile_pictures/'
    
    ext = filename.split('.')[-1]

    filepath = os.path.join(upload_to, ext)

    if os.path.exists(os.path.join('media', filepath)):
        filename = f'{filename.split(".")[0]}.{ext}'

    
    return os.path.join(upload_to, filename)

# user profile model
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    profile_picture = models.ImageField(upload_to=get_upload_path, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        return self.user.username
    
    @receiver(post_save, sender=User)
    def create_user_profile(sender, instance, created, **kwargs):
        if created:
            Profile.objects.create(user=instance)

    @receiver(post_save, sender=User)
    def save_user_profile(sender, instance, **kwargs):
        instance.profile.save()
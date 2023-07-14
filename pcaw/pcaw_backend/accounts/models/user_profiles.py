from django.db import models
from django.contrib.auth.models import User

#make use of framework's existing User model 
class UserProfile(models.Model):
    user = models.OneToOneField(
        User, # which contains id, username, email, first_name, last_name, password,
        related_name='profile',
        on_delete=models.CASCADE,
        primary_key=True
    )
    
    code = models.CharField(max_length=255, unique=True, null=True) 
    bio = models.TextField(max_length=255, default='', blank=True, null=True)
    
    def __str__(self):
        return str(self.user.pk) + "_" + self.user.username

    

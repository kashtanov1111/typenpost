import re
import os

from django.core import validators
from django.utils.deconstruct import deconstructible
from django.utils.translation import gettext_lazy as _

from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models
from django.db.models.signals import post_save, pre_save

@deconstructible
class CustomUnicodeUsernameValidator(validators.RegexValidator):
    regex = r"^[\w.]+\Z"
    message = _(
        "Enter a valid username. This value may contain only letters, "
        "numbers, and ./_ characters."
    )
    flags = 0

def handle_user_avatar_path(instance, filename):
    username = instance.user.username
    return os.path.join(username, 'avatar', filename)

class CustomUser(AbstractUser):

    username_validator = CustomUnicodeUsernameValidator()
    
    email = models.EmailField(unique=True, blank=False)
    username = models.CharField(
        _("username"),
        max_length=20,
        unique=True,
        help_text=_(
            "Required. 20 characters or fewer. Letters, digits and ./_ only."
        ),
        validators=[username_validator],
        error_messages={
            "unique": _("A user with that username already exists."),
        },
    )
    first_name = models.CharField(_("first name"), max_length=30, blank=True)
    last_name = models.CharField(_("last name"), max_length=40, blank=True)


class Follow(models.Model):
    to_user = models.ForeignKey(
        "UserProfile", on_delete=models.CASCADE, related_name='+')
    from_user = models.ForeignKey(
        "UserProfile", on_delete=models.CASCADE, related_name='+')
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                name="%(app_label)s_%(class)s_unique_relationships",
                fields=['from_user', 'to_user'],
            ),
            models.CheckConstraint(
                name="%(app_label)s_%(class)s_prevent_self_follow",
                check=~models.Q(from_user=models.F("to_user")),
            ),
        ]
    
    def __str__(self):
        return '%s follows %s' % (self.from_user.user, self.to_user.user)

class UserProfile(models.Model):
    user = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE, related_name='profile')
    avatar = models.ImageField(
        upload_to=handle_user_avatar_path, blank=True, null=True)
    about = models.TextField(max_length=350, null=True, blank=True)
    followers = models.ManyToManyField(
        to='self', blank=True, related_name='following',
        through=Follow, symmetrical=False)

    def __str__(self):
        return self.user.username

def userprofile_pre_save_receiver(
    sender, instance, *args, **kwargs):

    try:
        object = sender.objects.get(pk=instance.pk)
    except sender.DoesNotExist:
        return False
        
    try:
        old_file_path = object.avatar.path
    except:
        old_file_path = None

    try:
        new_file_path = instance.avatar.path
    except:
        new_file_path = None
    if (old_file_path is not None and 
        old_file_path != new_file_path):
        if os.path.isfile(old_file_path):
            os.remove(old_file_path)

pre_save.connect(userprofile_pre_save_receiver, sender=UserProfile)
    
def customuser_post_save_receiver(
    sender, instance, created, *args, **kwargs):
    if created == True:
        UserProfile.objects.create(user=instance)

post_save.connect(customuser_post_save_receiver, sender=CustomUser)


from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm, UserChangeForm

from accounts.models import UserProfile

class CustomUserCreationForm(UserCreationForm):

    class Meta:
        model = get_user_model()
        fields = ('email', 'username')

class CustomUserChangeForm(UserChangeForm):

    class Meta:
        model = get_user_model()
        fields = ('first_name', 'last_name', 'name')


class UserProfileChangeForm(forms.ModelForm):

    class Meta:
        model = UserProfile
        fields = ('about',)

class CustomUserUsernameChangeForm(UserChangeForm):

    class Meta:
        model = get_user_model()
        fields = ('username',)

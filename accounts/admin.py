from django.apps import apps
from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

from .forms import CustomUserChangeForm, CustomUserCreationForm

from .models import UserProfile, Follow

CustomUser = get_user_model()

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    extra = 0


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display =  ['email', 'username']
    inlines = [UserProfileInline, ]

admin.site.register(Follow)
admin.site.register(CustomUser, CustomUserAdmin)

app = apps.get_app_config('graphql_auth')

for model_name, model in app.models.items():
    admin.site.register(model)
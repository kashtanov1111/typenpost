"""config URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from graphene_django.views import GraphQLView

from graphql_jwt.decorators import jwt_cookie

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('', TemplateView.as_view(template_name='home.html')),
    path('admin-2281953/', admin.site.urls),
    path('graphql/', 
        jwt_cookie(csrf_exempt(GraphQLView.as_view(graphiql=True)))),
    path('<str:path_name1>/', 
        TemplateView.as_view(template_name='home.html')),
    path('<str:path_name1>/<str:path_name2>/', 
        TemplateView.as_view(template_name='home.html')),
    path('<str:path_name1>/<str:path_name2>/<str:path_name3>/', 
        TemplateView.as_view(template_name='home.html')),
    path('<str:path_name1>/<str:path_name2>/<str:path_name3>/<str:path_name4>/', 
        TemplateView.as_view(template_name='home.html')),
    path('<str:path_name1>/<str:path_name2>/<str:path_name3>/<str:path_name4>/<str:path_name5>/', 
        TemplateView.as_view(template_name='home.html')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG: # new
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns

from django.core import management
from apscheduler.schedulers.background import BackgroundScheduler

def every_minute_delete_refresh_tokens():
    management.call_command('cleartokens', '--expired')

def start():
    scheduler = BackgroundScheduler()
    scheduler.add_job(
        every_minute_delete_refresh_tokens, 
        'interval', seconds=120)
    scheduler.start()

from django.dispatch import receiver
from graphql_jwt.refresh_token.signals import refresh_token_rotated

@receiver(refresh_token_rotated)
def revoke_refresh_token(sender, request, refresh_token, **kwargs):
    refresh_token.revoke(request)


start()
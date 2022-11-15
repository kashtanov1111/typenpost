from django.core import management
from apscheduler.schedulers.background import BackgroundScheduler
 
from django.dispatch import receiver

from graphql_jwt.refresh_token.signals import refresh_token_rotated
from graphql_jwt.refresh_token.utils import get_refresh_token_model

@receiver(refresh_token_rotated)
def revoke_refresh_token(sender, request, refresh_token, **kwargs):
    refresh_token.revoke(request)

def every_minute_delete_refresh_tokens():
    management.call_command('cleartokens', '--expired')

def start():
    scheduler = BackgroundScheduler()
    scheduler.add_job(
        every_minute_delete_refresh_tokens, 
        'interval', seconds=120)
    scheduler.start()
start()

#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


from django.core import management
from apscheduler.schedulers.background import BackgroundScheduler
 
def every_minute_delete_refresh_tokens():
    management.call('cleartokens')
 
scheduler = BackgroundScheduler()
scheduler.add_job(
    every_minute_delete_refresh_tokens, 
    'interval', seconds=5)


if __name__ == '__main__':
    main()
    scheduler.start()

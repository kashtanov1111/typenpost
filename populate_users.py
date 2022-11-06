import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()
# from config import settings
# settings.configure()

from accounts.models import CustomUser

me = CustomUser.objects.get(username='1kashtanov')

def populate(N=50):

    for i in range(N):
        email = str(i + 60) + '@gmail.com'
        user = CustomUser.objects.create(username=i + 60, email=email, password='testpass123')
        me.profile.followers.add(user.profile)

    # COMPANY = Company.objects.order_by('company_name')

    # for i in range(3):
    #     for j in range(len(COMPANY)):
    #         fake_first_name = fakegen.first_name()
    #         fake_last_name = fakegen.last_name()
    #         WORKER = Worker.objects.get_or_create(company=COMPANY[j], first_name=fake_first_name, last_name=fake_last_name)[0]

# def populate2(N=30):

#     for i in range(N):
#         fake_first_name = fakegen.first_name()
#         fake_last_name = fakegen.last_name()
#         fake_email = fakegen.email()
#         USER = User.objects.get_or_create(first_name=fake_first_name, last_name=fake_last_name, email=fake_email)

if __name__ == '__main__':
    print('start')
    populate()
    print('finish')
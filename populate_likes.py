import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()
# from config import settings
# settings.configure()

from accounts.models import CustomUser
from posts.models import Post

post = Post.objects.get(id="642ef50e-d6a0-4141-8583-f519a689a61f")

def populate(N=30):

    for i in range(N):
        user = CustomUser.objects.get(username=i)
        post.likes.add(user)

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
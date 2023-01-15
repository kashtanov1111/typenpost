import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()
# from config import settings
# settings.configure()

from accounts.models import CustomUser
from posts.models import Post
from comments.models import Comment

comment = Comment.objects.get(id="ced81a2b-dfda-4ca0-bb9e-5b66e71e9880")
post = Post.objects.get(id="06e4505d-2c67-4c53-bd63-7e74ae0a80a3")

def populate(N=50):

    for i in range(N):
        user = CustomUser.objects.get(username=i)
        Comment.objects.create(post=post, text="Reply " + str(i), user=user, reply=comment)

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
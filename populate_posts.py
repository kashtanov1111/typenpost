import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()
# from config import settings
# settings.configure()

from accounts.models import CustomUser
from posts.models import Post

me = CustomUser.objects.get(username='1kashtanov')

def populate(N=120):

    for i in range(N):
        user = Post.objects.create(user=me, text="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).")

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
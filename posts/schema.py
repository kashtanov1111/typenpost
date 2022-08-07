import graphene
from graphene_django import DjangoObjectType

from .models import Post

class PostType(DjangoObjectType):

    class Meta:
        model = Post

class Query(graphene.ObjectType):
    posts = graphene.List(PostType)

    def resolve_posts(self, info):
        return Post.objects.all()

from django.contrib.auth import get_user_model

User = get_user_model()

class CreatePost(graphene.Mutation):
    id = graphene.UUID()
    text = graphene.String()
    created = graphene.DateTime()

    class Arguments:
        text = graphene.String()

    def mutate(self, info, text):
        user = User.objects.get(username='1kashtanov')
        post = Post(text=text, user=user)
        post.save()

        return CreatePost(
            id=post.id,
            text=post.text,
            created=post.created
        )

class Mutation(graphene.ObjectType):
    createPost = CreatePost.Field()

schema = graphene.Schema(
    query=Query,
    mutation=Mutation
)
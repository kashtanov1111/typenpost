import graphene
import django_filters

from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField

from graphql_jwt.decorators import login_required

from .models import Post

class PostFilter(django_filters.FilterSet):
    text = django_filters.CharFilter(lookup_expr='iexact')

    class Meta:
        model = Post
        fields = {
            'text': ['icontains',],
        }
    
    order_by = django_filters.OrderingFilter(
        fields=(
            ('text', 'created',),
        )
    )


class PostNode(DjangoObjectType):
    class Meta:
        model = Post
        filterset_class = PostFilter
        fields = ('id', 'text', 'created', 'updated', 'user', 'comments')
        interfaces = (graphene.relay.Node, )

        
class Query(graphene.ObjectType):
    post = graphene.relay.Node.Field(PostNode)
    posts = DjangoFilterConnectionField(PostNode)
    feed = DjangoFilterConnectionField(PostNode)

    @login_required
    def resolve_feed(parent, info):
        user = info.context.user
        return Post.objects.feed(user=user)

    def resolve_posts(parent, info):
        return Post.objects.select_related('user').prefetch_related('comments').all()


class CreatePost(graphene.Mutation):
    post = graphene.Field(PostNode)

    class Arguments:
        text = graphene.String(required=True)

    @login_required
    def mutate(root, info, text):
        user = info.context.user
        post = Post(text=text, user=user)
        post.save()

        return CreatePost(post=post)

class UpdatePost(graphene.Mutation):
    post = graphene.Field(PostNode, id=graphene.UUID())

    class Arguments:
        id = graphene.UUID(required=True)
        text = graphene.String(required=True)

    @login_required
    def mutate(root, info, id=None, text=None):
        if id is not None and text is not None:
            user = info.context.user
            qs = Post.objects.filter(id=id, user=user)
            if qs.exists():
                post = qs.first()
                post.text = text
                post.save()
                return UpdatePost(post=post)
            else:
                raise Exception('There is no object with this id or you have not a permission to change this post')
        else:
            raise Exception('You have not provided id or text')


class Mutation(graphene.ObjectType):
    create_post = CreatePost.Field()
    update_post = UpdatePost.Field()
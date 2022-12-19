import graphene
import django_filters
from django.db.models import Prefetch
from django.contrib.auth import get_user_model

from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField

from graphql_jwt.decorators import login_required

from .models import Post

from graphene import relay

from graphql_auth.schema import UserNode

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
    user = graphene.Field(UserNode, required=False)
    number_of_likes = graphene.Int()
    has_i_liked = graphene.Boolean()
    uuid = graphene.UUID()
    class Meta:
        model = Post
        filterset_class = PostFilter
        fields = ('id', 'text', 'created', 'updated', 'user', 'comments', 'likes', 'uuid')
        interfaces = (graphene.relay.Node, )

    def resolve_uuid(parent, info):
        return parent.pk

    def resolve_has_i_liked(parent, info):
        me = info.context.user
        if me.is_authenticated:
            if parent.amIInLikes:
                return True
            else: 
                return False
        else:
            return False

    def resolve_number_of_likes(parent, info):
        return parent.likes.count()

    @classmethod
    def get_queryset(cls, queryset, info, *args, **kwargs):
        me_username = info.context.user.username
        return (
            queryset
            .select_related('user')
            .prefetch_related(
                Prefetch(
                    'likes', 
                    queryset=(
                        get_user_model().objects
                            .filter(status__archived=False))
            ))
            .prefetch_related(
                Prefetch(
                    'likes',
                    queryset=(
                        get_user_model().objects
                            .filter(username=me_username)
                    ),
                    to_attr='amIInLikes'
                )
            )
        )
        
class Query(graphene.ObjectType):
    post = graphene.relay.Node.Field(PostNode)
    posts = DjangoFilterConnectionField(PostNode)
    feed = DjangoFilterConnectionField(PostNode)

    @login_required
    def resolve_feed(parent, info, *args, **kwargs):
        user = info.context.user
        return (Post.objects
            .feed(user=user)
            .select_related('user__profile')
            .filter(user__status__archived=False)
            )

class LikePost(graphene.Mutation):
    post = graphene.Field(PostNode)
    action = graphene.String()

    class Arguments:
        uuid = graphene.UUID(required=True)
    
    @login_required
    def mutate(root, info, uuid=None):
        user = info.context.user
        username = user.username
        post = Post.objects.get(id=uuid)
        if post.likes.filter(username=username).exists():
            post.likes.remove(user)
            action = 'unliked'
        else:
            post.likes.add(user)
            action = 'liked'
        post.save()
        return LikePost(post=post, action=action)


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

# class DeletePost(graphene.Mutation):
#     post = graphene.Field(PostNode, id=graphene.UUID())

#     class Arguments:
#         id = graphene.UUID(required=True)

#     @login_required
#     def mutate()

class Mutation(graphene.ObjectType):
    create_post = CreatePost.Field()
    update_post = UpdatePost.Field()
    like_post = LikePost.Field()

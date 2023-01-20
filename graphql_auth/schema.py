from django.contrib.auth import get_user_model
from django.db.models import Prefetch


import graphene

from graphene_django.filter.fields import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType

from .settings import graphql_auth_settings as app_settings

from django.contrib.auth import get_user_model
from accounts.models import UserProfile

from graphql_jwt.decorators import login_required

# from posts.schema import PostNode
from posts.models import Post

class UserNode(DjangoObjectType):

    pk = graphene.Int()
    archived = graphene.Boolean()
    verified = graphene.Boolean()
    secondary_email = graphene.String()
    number_of_posts = graphene.Int()

    class Meta:
        model = get_user_model()
        filter_fields = app_settings.USER_NODE_FILTER_FIELDS
        exclude = app_settings.USER_NODE_EXCLUDE_FIELDS
        interfaces = (graphene.relay.Node,)
        # skip_registry = True

    def resolve_number_of_posts(parent, info):
        return parent.posts.count()

    def resolve_pk(parent, info):
        return parent.pk

    def resolve_archived(parent, info):
        return parent.status.archived

    def resolve_verified(parent, info):
        return parent.status.verified

    def resolve_secondary_email(parent, info):
        return parent.status.secondary_email

    @classmethod
    def get_queryset(cls, queryset, info):
        return queryset.select_related('profile').filter(status__archived=False)


class UserProfileNode(DjangoObjectType):
    number_of_followers = graphene.Int()
    number_of_following = graphene.Int()
    am_i_following = graphene.Boolean()
    is_he_following = graphene.Boolean()
    user = graphene.Field(UserNode, required=False)
    followers = DjangoFilterConnectionField(lambda: UserProfileNode, required=False)

    class Meta:
        model = UserProfile
        fields = ('user', 'avatar', 'about', 'followers'
            'pk', 'following')
        filter_fields = ['about',]
        interfaces = (graphene.relay.Node, )
    
    def resolve_avatar(root, info):
        if root.avatar:
            return root.avatar.url
        else:
            return None
    
    def resolve_number_of_followers(parent, info):
        return parent.followers.filter(user__status__archived=False).count()

    def resolve_number_of_following(parent, info):
        return parent.following.filter(user__status__archived=False).count()
    
    def resolve_am_i_following(parent, info):
        user = info.context.user
        if user.is_authenticated:
            try: 
                if parent.followers_me:
                    return True        
                else:
                    return False
            except:
                if parent.followers.filter(user=user).exists():
                    return True        
                else:
                    return False
        else:
            return False
            
    
    def resolve_is_he_following(parent, info):
        user = info.context.user
        if user.is_authenticated:
            if parent.following_me:
                return True
            else:
                return False
        else:
            return False

    @classmethod
    def get_queryset(cls, queryset, info):
        me = info.context.user
        return (
            queryset
            .filter(user__status__archived=False)
            .prefetch_related(Prefetch('followers', queryset=UserProfile.objects.filter(user=me), to_attr='followers_me'))
            .prefetch_related(Prefetch('following', queryset=UserProfile.objects.filter(user=me), to_attr='following_me'))
            .select_related('user')
            .order_by('-id')
        )

class UserQuery(graphene.ObjectType):
    user = graphene.Field(UserNode, username=graphene.String())

    def resolve_user(parent, info, username):
        user = info.context.user
        if user.is_authenticated:
            queryset = UserProfile.objects.filter(user=user)
        else:
            queryset = UserProfile.objects.none()
        return (get_user_model().objects
            .select_related('profile')
            .select_related('status')
            .filter(status__archived=False)
            .prefetch_related(Prefetch('profile__followers', queryset=queryset, to_attr='followers_me'))
            .prefetch_related(Prefetch('profile__following', queryset=queryset, to_attr='following_me'))
            .get(username=username))
    

class MeQuery(graphene.ObjectType):
    me = graphene.Field(UserNode)

    def resolve_me(parent, info):
        user = info.context.user
        if user.is_authenticated:
            return user
        return None

import graphene
import graphql_jwt

from graphene_django import DjangoObjectType
from graphene_django.utils import camelize
from graphql_jwt.decorators import login_required

from graphql_auth.schema import UserQuery, MeQuery
from graphql_auth import mutations

from .models import CustomUser, UserProfile
from .forms import (
    CustomUserChangeForm, 
    UserProfileChangeForm,
    CustomUserUsernameChangeForm)

class UserProfileNode(DjangoObjectType):
    number_of_followers = graphene.Int()
    number_of_following = graphene.Int()
    am_i_following = graphene.String()
    class Meta:
        model = UserProfile
        fields = ('user', 'avatar', 'about', 'followers')
        interfaces = (graphene.relay.Node, )
    
    def resolve_avatar(parent, info):
        if parent.avatar:
            return parent.avatar.url
        else:
            return None
    
    def resolve_number_of_followers(parent, info):
        return parent.followers.count()

    def resolve_number_of_following(parent, info):
        return parent.following.count()
    
    @login_required
    def resolve_am_i_following(parent, info):
        me = info.context.user
        if parent.followers.filter(user=me).exists():
            return 'yes'        
        else:
            return 'no'

class Query(UserQuery, MeQuery, graphene.ObjectType):
    pass

class AuthMutation(graphene.ObjectType):
    register = mutations.Register.Field()
    verify_account = mutations.VerifyAccount.Field()
    resend_activation_email = mutations.ResendActivationEmail.Field()
    send_password_reset_email = mutations.SendPasswordResetEmail.Field()
    password_reset = mutations.PasswordReset.Field()
    password_set = mutations.PasswordSet.Field() # For passwordless registration
    password_change = mutations.PasswordChange.Field()
    update_account = mutations.UpdateAccount.Field()
    archive_account = mutations.ArchiveAccount.Field()
    delete_account = mutations.DeleteAccount.Field()
    send_secondary_email_activation =  mutations.SendSecondaryEmailActivation.Field()
    verify_secondary_email = mutations.VerifySecondaryEmail.Field()
    swap_emails = mutations.SwapEmails.Field()
    remove_secondary_email = mutations.RemoveSecondaryEmail.Field()

    # django-graphql-jwt inheritances
    token_auth = mutations.ObtainJSONWebToken.Field()
    # verify_token = mutations.VerifyToken.Field()
    # refresh_token = mutations.RefreshToken.Field()
    # revoke_token = mutations.RevokeToken.Field()

    # token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    revoke_token = graphql_jwt.Revoke.Field()
    delete_token_cookie = graphql_jwt.DeleteJSONWebTokenCookie.Field()
    delete_refresh_token_cookie = graphql_jwt.DeleteRefreshTokenCookie.Field()

class FollowingUser(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        username = graphene.String(required=True)

    @login_required
    def mutate(root, info, username):
        from_user = info.context.user
        from_user_profile = from_user.profile
        to_user = CustomUser.objects.get(username=username)
        if to_user.profile.followers.filter(user=from_user).exists():
            to_user.profile.followers.remove(from_user_profile)
        else:
            to_user.profile.followers.add(from_user_profile)
        to_user.save()
        return FollowingUser(success=True)

class ErrorType(graphene.Scalar):
    @staticmethod
    def serialize(errors):
        if isinstance(errors, dict):
            if errors.get("__all__", False):
                errors["non_field_errors"] = errors.pop("__all__")
            return camelize(errors)
        raise Exception("`errors` should be dict!")

class EditProfile(graphene.Mutation):
    success = graphene.Boolean()
    errors_user = graphene.Field(ErrorType)
    errors_user_profile = graphene.Field(ErrorType)

    class Arguments:
        firstName = graphene.String()
        lastName = graphene.String()
        about = graphene.String()
        
    @login_required
    def mutate(root, info, firstName='', lastName='', about=''):
        user = info.context.user
        form_user = CustomUserChangeForm(
            instance=user, 
            data={ 
                'first_name': firstName, 
                'last_name': lastName})
        form_user_profile = UserProfileChangeForm(
            instance=user.profile,
            data={
                'about': about
            }
        )
        if form_user.is_valid() and form_user_profile.is_valid():
            form_user.save()
            form_user_profile.save()
            return EditProfile(
                success=True, 
                errors_user=form_user.errors,
                errors_user_profile=form_user_profile.errors)
        return EditProfile(
            success=False, 
            errors_user=form_user.errors,
            errors_user_profile=form_user_profile.errors)

class UsernameChange(graphene.Mutation):
    success = graphene.Boolean()
    errors = graphene.Field(ErrorType)

    class Arguments:
        username = graphene.String(required=True)

    @login_required
    def mutate(root, info, username):
        user = info.context.user
        form = CustomUserUsernameChangeForm(
            instance=user,
            data={'username': username}
        )
        if form.is_valid():
            form.save()
            return UsernameChange(success=True, errors=form.errors)
        return UsernameChange(success=False, errors=form.errors)

class Mutation(AuthMutation, graphene.ObjectType):
    following_user = FollowingUser.Field()
    edit_profile = EditProfile.Field()
    username_change = UsernameChange.Field()

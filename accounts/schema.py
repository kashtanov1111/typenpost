import base64
from random import randint
from django.core.files.base import ContentFile

import graphene
import graphql_jwt

import graphene_django_optimizer as gql_optimizer

from graphene_django import DjangoObjectType
from graphene_django.utils import camelize
from graphql_jwt.decorators import login_required

from graphql_auth.schema import UserNode, UserQuery, MeQuery
from graphql_auth import mutations
from graphene_django.filter.fields import DjangoFilterConnectionField

from .models import CustomUser, UserProfile
from .forms import (
    CustomUserChangeForm, 
    UserProfileChangeForm,
    CustomUserUsernameChangeForm)

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
        to_user_followers = to_user.profile.followers
        if to_user_followers.filter(user=from_user).exists():
            to_user_followers.remove(from_user_profile)
        else:
            to_user_followers.add(from_user_profile)
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
        avatar = graphene.String()
        
    @login_required
    def mutate(root, info, firstName='', lastName='', about='', avatar=''):
        user = info.context.user
        user_profile = user.profile
        if avatar:
            format, encoded_avatar = avatar.split(';base64,') 
            ext = format.split('/')[-1]
            random_number = randint(1, 100000)
            decoded_avatar = ContentFile(
                base64.b64decode(encoded_avatar), 
                name=str(random_number) + '.' + ext)
            user_profile.avatar = decoded_avatar
            user_profile.save()
        form_user = CustomUserChangeForm(
            instance=user, 
            data={ 
                'first_name': firstName, 
                'last_name': lastName})
        form_user_profile = UserProfileChangeForm(
            instance=user_profile,
            data={
                'about': about,
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

class DeleteUserProfileAvatar(graphene.Mutation):
    success = graphene.Boolean()

    @login_required
    def mutate(root, info):
        user = info.context.user
        user_profile = user.profile
        user_profile.avatar = ''
        user_profile.save()
        return DeleteUserProfileAvatar(success=True)

class Mutation(AuthMutation, graphene.ObjectType):
    following_user = FollowingUser.Field()
    edit_profile = EditProfile.Field()
    username_change = UsernameChange.Field()
    delete_user_profile_avatar = DeleteUserProfileAvatar.Field()
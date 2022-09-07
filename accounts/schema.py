import graphene
import graphql_jwt

from graphene_django import DjangoObjectType

from graphql_auth.schema import UserQuery, MeQuery
from graphql_auth import mutations

from .models import UserProfile

class UserProfileNode(DjangoObjectType):
    class Meta:
        model = UserProfile
        fields = ('user', 'avatar', 'about', 'followers', 'user')
        interfaces = (graphene.relay.Node, )
    
    def resolve_avatar(parent, info):
        if parent.avatar:
            return parent.avatar.url
        else:
            return None

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





class Mutation(AuthMutation, graphene.ObjectType):
    pass


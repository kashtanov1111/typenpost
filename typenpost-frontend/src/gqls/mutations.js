import { gql } from "@apollo/client"

export const REFRESH_TOKEN = gql`
  mutation RefreshToken {
    refreshToken {
      payload
    }
  }
`
export const DELETE_TOKEN = gql`
  mutation DeleteTokenCookie {
    deleteTokenCookie {
      deleted
    }
  }
`
export const DELETE_REFRESH_TOKEN = gql`
  mutation DeleteRefreshTokenCookie {
    deleteRefreshTokenCookie {
      deleted
    }
  }
`

export const VERIFY_ACCOUNT = gql`
    mutation VerifyAccount($token: String!) {
        verifyAccount(token: $token) {
            success
            errors
        }
    }
`

export const SEND_PASSWORD_RESET_EMAIL = gql`
    mutation SendPasswordResetEmail($email: String!) {
        sendPasswordResetEmail(email: $email) {
            success
            errors
        }
    }
`

export const PASSWORD_RESET = gql`
    mutation PasswordReset($token: String!,
                            $newPassword1: String!,
                            $newPassword2: String!) {
        passwordReset(token: $token,
                        newPassword1: $newPassword1,
                        newPassword2: $newPassword2) {
            success
            errors
        }
    }
`

export const PASSWORD_CHANGE = gql`
    mutation PasswordChange($oldPassword: String!,
                            $newPassword1: String!,
                            $newPassword2: String!) {
        passwordChange(oldPassword: $oldPassword,
                        newPassword1: $newPassword1,
                        newPassword2: $newPassword2) {
            success
            errors
        }
    }
`

export const LOGIN_MUTATION = gql`
    mutation tokenAuth(
        $username: String
        $email: String
        $password: String!
    ) {
        tokenAuth(
            username: $username
            password: $password
            email: $email
        ) {
            success
            errors
        }
    }
`

export const REGISTER_MUTATION = gql`
    mutation register(
        $username: String!
        $email: String!
        $password1: String!
        $password2: String!
    ) {
        register(
            username: $username
            email: $email
            password1: $password1
            password2: $password2
        ) {
            success
            errors
        }
    }
`

export const RESEND_ACTIVATION_EMAIL = gql`
    mutation ResendActivationEmail($email: String!) {
        resendActivationEmail(email: $email) {
            success
            errors
        }
    }
`

export const FOLLOWING_USER = gql`
    mutation FollowingUser($username: String!) {
        followingUser(username: $username) {
            success
            action
        }
    }
`

export const EDIT_PROFILE = gql`
    mutation EditProfile(
        $about: String
        $name: String
        $avatar: String
        ) {
        editProfile(
            about: $about
            name: $name
            avatar: $avatar
            ) {
            success
            errorsUser
            errorsUserProfile
            user {
                id
                name
                profile {
                    id
                    about
                    avatar
                }
            }
        }
    }
`

export const USERNAME_CHANGE = gql`
    mutation UsernameChange(
        $username: String!
        ) {
        usernameChange(
            username: $username
            ) {
            success
            errors
        }
    }
`

export const SEND_SECONDARY_EMAIL_ACTIVATION = gql`
    mutation SendSecondaryEmailActivation(
        $email: String!
        $password: String!
        ) {
        sendSecondaryEmailActivation(
            email: $email
            password: $password
            ) {
            success
            errors
        }
    }
`

export const VERIFY_SECONDARY_EMAIL = gql`
    mutation VerifySecondaryEmail($token: String!) {
        verifySecondaryEmail(token: $token) {
            success
            errors
        }
    }
`

export const SWAP_EMAILS = gql`
    mutation SwapEmails($password: String!) {
        swapEmails(password: $password) {
            success
            errors
        }
    }
`

export const REMOVE_SECONDARY_EMAIL = gql`
    mutation RemoveSecondaryEmail($password: String!) {
        removeSecondaryEmail(password: $password) {
            success
            errors
        }
    }
`

export const ARCHIVE_ACCOUNT = gql`
    mutation ArchiveAccount($password: String!) {
        archiveAccount(password: $password) {
            success
            errors
        }
    }
`

export const DELETE_USER_PROFILE_AVATAR = gql`
    mutation DeleteUserProfileAvatar {
        deleteUserProfileAvatar {
            success
        }
    }
`







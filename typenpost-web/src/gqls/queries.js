import { gql } from "@apollo/client"

export const QUERY_ME = gql`
    query CheckIfUserIsAuthenticated {
        me {
            id
            username
            firstName
            lastName
            email
            dateJoined
            secondaryEmail
            verified
            profile {
              id
              avatar
              about
            }
        }
    }
`

export const USER_PROFILE = gql`
    query UserProfile($username: String!) {
        user(username: $username) {
            id
            username
            firstName
            lastName
            dateJoined
            email
            secondaryEmail
            profile {
                id
                avatar
                about
                numberOfFollowers
                numberOfFollowing
                amIFollowing
                isHeFollowing
            }
        }
    }
`

export const USER_FOLLOWERS = gql`
    query userFollowers($username: String!) {
        userFollowers(username: $username) {
            edges {
                node {
                    id
                    avatar
                    amIFollowing
                    isHeFollowing
                    user {
                        id
                        username
                        firstName
                        lastName
                    }
                }
            }
        }
    }
`

export const POST_FEED = gql`
    query PostFeed {
        feed {
            edges {
                node {
                    id
                    text
                    updated
                    created
                    user {
                        username
                    }
                }
            }
        }
    }
`

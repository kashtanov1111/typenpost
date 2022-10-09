import { gql } from "@apollo/client"

export const QUERY_ME = gql`
    query CheckIfUserIsAuthenticated {
        me {
            id
            username
            profile {
              avatar
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

export const USER_PROFILE = gql`
    query UserProfile($id: ID!) {
        user(id: $id) {
            username
            firstName
            lastName
            dateJoined
            profile {
                avatar
                about
                numberOfFollowers
                numberOfFollowing
            }
        }
    }
`

export const AM_I_FOLLOWING = gql`
    query AmIFollowing($username: String!) {
        amIFollowing(username: $username)
    }
`
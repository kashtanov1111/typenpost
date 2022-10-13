import { gql } from "@apollo/client"

export const QUERY_ME = gql`
    query CheckIfUserIsAuthenticated {
        me {
            id
            username
            firstName
            lastName
            profile {
              avatar
              about
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
            id
            username
            firstName
            lastName
            dateJoined
            profile {
                avatar
                about
                numberOfFollowers
                numberOfFollowing
                amIFollowing
            }
        }
    }
`
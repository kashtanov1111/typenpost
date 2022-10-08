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
            lastLogin
            username
            firstName
            lastName
            dateJoined
            email
            profile {
                avatar
                about
            }
        }
    }
`

// export const MY_PROFILE = gql`
//     query MyProfile($id: ID!) {
//         user(id: $id) {
//             lastLogin
//             username
//             firstName
//             lastName
//             dateJoined
//             email
//             profile {
//                 avatar
//                 about
//             }
//         }
//     }
// `

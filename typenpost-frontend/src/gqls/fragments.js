import { gql } from "@apollo/client";

export const CORE_USER_FIELDS = gql`
    fragment CoreUserFields on UserNode {
        id
        username
        email
        secondaryEmail
        profile {
            id
            avatar
        }
    } 
`

export const CORE_FOLLOW_LIST_FIELDS = gql`
    fragment CoreFollowListFields on UserProfileNodeConnection {
        pageInfo {
            hasNextPage
            endCursor
            startCursor
            hasPreviousPage
        }
        edges {
            node {
                id
                avatar
                amIFollowing
                isHeFollowing
                user {
                    id
                    username
                    name
                }
            }
            cursor
        }
    }
`
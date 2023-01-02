import { gql } from "@apollo/client"
import { CORE_USER_FIELDS, CORE_FOLLOW_LIST_FIELDS } from "./fragments"

export const QUERY_ME = gql`
    ${CORE_USER_FIELDS}
    query profoundUserQuery {
        me {
            ...CoreUserFields
        }
    }
`

export const QUERY_ME_FOR_EDIT_PROFILE = gql`
    query userQueryForEditProfile {
        me {
            id
            name
            profile {
                id
                about
                avatar
            }
        }
    }
`

export const USER_PROFILE_TOP = gql`
    ${CORE_USER_FIELDS}
    query UserProfile($username: String!) {
        user(username: $username) {
            ...CoreUserFields
            name
            numberOfPosts
            dateJoined
            profile {
                about
                numberOfFollowers
                numberOfFollowing
                amIFollowing
                isHeFollowing
            }
        }
    }
`

export const USER_PROFILE_POSTS = gql`
    query UserProfile(
        $username: String!
        $cursor: String ) {
        user(username: $username) {
            id
            posts(first: 10, after: $cursor) {
                pageInfo {
                    hasNextPage
                    endCursor
                    startCursor
                    hasPreviousPage
                }
                edges {
                    node {
                        id
                        uuid
                        text
                        created
                        numberOfLikes
                        numberOfComments
                        hasILiked
                    }
                    cursor
                }
            }
        }
    }
`

export const USER_FOLLOWERS = gql`
    ${CORE_FOLLOW_LIST_FIELDS}
    query UserFollowers(
            $username: String!
            $cursor: String
            ) {
        user(username: $username) {
            id
            profile {
                id
                followers(first: 20, after: $cursor) {
                    ...CoreFollowListFields
                }
            }
        }
    }
`

export const USER_FOLLOWING = gql`
    ${CORE_FOLLOW_LIST_FIELDS}
    query UserFollowing(
            $username: String!
            $cursor: String
            ) {
        user(username: $username) {
            id
            profile {
                id
                following(first: 20, after: $cursor) {
                    ...CoreFollowListFields
                }
            }
        }
    }
`

export const POST_FEED = gql`
    query PostFeed($cursor: String) {
        feed(first: 10, after: $cursor) {
            pageInfo {
                hasNextPage
                endCursor
                startCursor
                hasPreviousPage
            }
            edges {
                node {
                    id
                    uuid
                    text
                    created
                    numberOfLikes
                    numberOfComments
                    hasILiked
                    user {
                        username
                        name
                        profile {
                            avatar
                        }
                    }
                }
                cursor
            }
        }
    }
`

export const POST_DETAIL = gql`
    query PostDetail($uuid: UUID) {
        post(uuid: $uuid) {
            id
            uuid
            text
            created
            numberOfLikes
            numberOfComments
            hasILiked
            user {
                username
                name
                profile {
                    avatar
                }
            }
        }
    }
`




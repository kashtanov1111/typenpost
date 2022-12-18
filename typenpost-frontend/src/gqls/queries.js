import { gql } from "@apollo/client"
import { CORE_USER_FIELDS } from "./fragments"

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

export const USER_PROFILE = gql`
    ${CORE_USER_FIELDS}
    query UserProfile(
        $username: String!
        $cursor: String ) {
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
            posts(first: 20, after: $cursor) {
                pageInfo {
                    hasNextPage
                    endCursor
                    startCursor
                    hasPreviousPage
                }
                edges {
                    node {
                        id
                        text
                        created
                        numberOfLikes
                    }
                    cursor
                }
            }
        }
    }
`

export const USER_FOLLOWERS = gql`
    query UserFollowers(
            $username: String!
            $cursor: String
            ) {
        user(username: $username) {
            id
            profile {
                id
                followers(first: 20, after: $cursor) {
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
            }
        }
    }
`

export const USER_FOLLOWING = gql`
    query UserFollowing(
            $username: String!
            $cursor: String
            ) {
        user(username: $username) {
            id
            profile {
                id
                following(first: 20, after: $cursor) {
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
            }
        }
    }
`

export const POST_FEED = gql`
    query PostFeed {
        feed {
            pageInfo {
                hasNextPage
                endCursor
                startCursor
                hasPreviousPage
            }
            edges {
                node {
                    id
                    text
                    created
                    numberOfLikes
                    user {
                        username
                        firstName
                        lastName
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



import { gql } from "@apollo/client"
import { CORE_USER_FIELDS } from "./fragments"

export const QUERY_ME = gql`
    ${CORE_USER_FIELDS}
    query CheckIfUserIsAuthenticated {
        me {
            ...CoreUserFields
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
                            user {
                                id
                                username
                                firstName
                                lastName
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
                            user {
                                id
                                username
                                firstName
                                lastName
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



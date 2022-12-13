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
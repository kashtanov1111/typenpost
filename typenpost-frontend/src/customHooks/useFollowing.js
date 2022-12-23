import { useContext, useState, useEffect } from 'react'
import { useMutation } from "@apollo/client";
import { ProfileIdContext } from '../context/LoginContext';
import { FOLLOWING_USER } from '../gqls/mutations';
import { ClientContext } from '../context/ApolloContext';
import { gql } from '@apollo/client';

export function useFollowing(
    userUsername,
    amIFollowing,
    improvedUserData,
    handleAlert
) {
    const client = useContext(ClientContext)
    const authenticatedUserProfileId = useContext(ProfileIdContext)
    function getAuthUserNumOfFollowingFromCache() {
        const authUserProfileFragment = client.readFragment({
            id: 'UserProfileNode:' + authenticatedUserProfileId,
            fragment: gql`
                fragment numberOfFollowers on UserProfileNode {
                    numberOfFollowing
                }
            `
        })
        if (authUserProfileFragment) {
            return authUserProfileFragment.numberOfFollowing
        } else {
            return 0
        }
    }

    const [handleFollow] = useMutation(FOLLOWING_USER, {
        variables: { username: userUsername },
        optimisticResponse: {
            followingUser: {
                fromUser: {
                    id: authenticatedUserProfileId,
                    __typename: 'UserProfileNode',
                    numberOfFollowing: getAuthUserNumOfFollowingFromCache() ?
                        (getAuthUserNumOfFollowingFromCache() + (amIFollowing ? -1 : 1)) : 0,
                },
                toUser: {
                    id: improvedUserData && improvedUserData.id,
                    __typename: 'UserProfileNode',
                    numberOfFollowers: improvedUserData && (improvedUserData.numberOfFollowers + (amIFollowing ? -1 : 1)),
                    amIFollowing: !amIFollowing,
                }
            }
        },
        onError: () => {
            handleAlert('An error occured, please try again.', 'danger')
        },
    })

    return {
        handleFollow: handleFollow
    }       
}
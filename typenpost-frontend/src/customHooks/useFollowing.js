import { useContext } from 'react'
import { useMutation } from "@apollo/client";
import { ProfileIdContext } from '../context/LoginContext';
import { FOLLOWING_USER } from '../gqls/mutations';

export function useFollowing(handleAlert, userUsername, profile) {
    const authenticatedUserProfileId = useContext(ProfileIdContext)

    const [handleFollow, {
        loading: loadingFollowingUser }] = useMutation(FOLLOWING_USER, {
            variables: { username: userUsername },
            update(cache, { data: { followingUser } }) {
                cache.modify({
                    id: 'UserProfileNode:' + authenticatedUserProfileId,
                    fields: {
                        numberOfFollowing(cachedValue) {
                            if (followingUser.action ===
                                'unfollowed') {
                                return cachedValue - 1
                            } else {
                                return cachedValue + 1
                            }
                        }
                    }
                })
                cache.modify({
                    id: 'UserProfileNode:' + profile.id,
                    fields: {
                        numberOfFollowers(cachedValue) {
                            if (followingUser.action ===
                                'followed') {
                                return cachedValue + 1
                            } else {
                                return cachedValue - 1
                            }
                        },
                        amIFollowing() {
                            if (followingUser.action ===
                                'followed') {
                                return true
                            } else {
                                return false
                            }
                        }
                    }
                })

            },
            onError: () => {
                handleAlert('An error occured, please try again.', 'danger')
            },
        })
    return {
        handleFollow: handleFollow, 
        loadingFollowingUser: loadingFollowingUser}
}
import { useState, useEffect } from "react"
import { useMutation } from "@apollo/client";
import { POST_LIKING } from '../gqls/mutations';


export function useLiking(post, handleAlert, authUsername) {
    const [hasILiked, setHasILiked] = useState(post.hasILiked)
    const [numberOfLikes, setNumberOfLikes] = useState(post.numberOfLikes)

    const [handleLikePost] = useMutation(
        POST_LIKING, {
        variables: {
            uuid: post.uuid
        },
        update(cache, { data: { likePost } }) {
            cache.modify({
                id: 'PostNode:' + post.id,
                fields: {
                    hasILiked() {
                        if (likePost.action ===
                            'liked') {
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
        }
    }
    )

    useEffect(() => {
        setNumberOfLikes(post.numberOfLikes)
    }, [post.numberOfLikes])


    function handleLikeBtnClicked(e) {
        e.stopPropagation()
        if (authUsername) {
            if (hasILiked === false) {
                setHasILiked(true)
                setNumberOfLikes(numberOfLikes + 1)
                handleLikePost()
            } else {
                setHasILiked(false)
                setNumberOfLikes(numberOfLikes - 1)
                handleLikePost()
            }
        }
    }

    return {
        handleLikeBtnClicked: handleLikeBtnClicked,
        hasILiked: hasILiked,
        numberOfLikes: numberOfLikes
    }
}
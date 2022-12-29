import { useMutation } from "@apollo/client";
import { POST_LIKING } from '../gqls/mutations';


export function useLiking(post, handleAlert) {
    const [handleLikePost] = useMutation(
        POST_LIKING, {
        variables: {
            uuid: post.uuid
        },
        optimisticResponse: {
            likePost: {
                post: {
                    id: post.id,
                    __typename: 'PostNode',
                    numberOfLikes: post.numberOfLikes + (post.hasILiked ? -1 : 1),
                    hasILiked: !post.hasILiked,
                }
            }
        },
        onError: (error) => {
            console.log(error)
            handleAlert('An error occured, please try again.', 'danger')
        }
    }
    )
    
    return {
        handleLikePost: handleLikePost
    }
}
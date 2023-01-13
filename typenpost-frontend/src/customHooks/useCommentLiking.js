import { useMutation } from "@apollo/client";
import { COMMENT_LIKING } from '../gqls/mutations';


export function useCommentLiking(comment, handleAlert) {
    
    const [handleLikeComment] = useMutation(
        COMMENT_LIKING, {
        variables: {
            uuid: comment.uuid
        },
        optimisticResponse: {
            likeComment: {
                comment: {
                    id: comment.id,
                    __typename: 'CommentNode',
                    numberOfLikes: comment.numberOfLikes + (comment.hasILiked ? -1 : 1),
                    hasILiked: !comment.hasILiked,
                }
            }
        },
        onError: () => {
            handleAlert('An error occured, please try again.', 'danger')
        }
    }
    )
    
    return {
        handleLikeComment: handleLikeComment
    }
}
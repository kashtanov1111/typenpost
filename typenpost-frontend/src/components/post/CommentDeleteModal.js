import { COMMENT_DELETING } from "../../gqls/mutations";
import { SpinnerForButton } from "../SpinnerForButton";
import { useMutation } from "@apollo/client";
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

export function CommentDeleteModal({
    commentId,
    commentUUID,
    handleAlert,
    parentCommentId,
    post,
    postId,
    setPost,
    setShowCommentDeleteModal,
    showCommentDeleteModal,
}) {
    const [handleDeleteComment, {
        loading: loadingDeleteComment
    }] = useMutation(
        COMMENT_DELETING, {
        variables: {
            uuid: commentUUID
        },
        update(cache) {
            cache.evict({ id: 'CommentNode:' + commentId })
            cache.gc()
            cache.modify({
                id: 'PostNode:' + postId,
                fields: {
                    numberOfComments(cachedValue) {
                        return cachedValue - 1
                    }
                }
            })
            setPost({
                ...post,
                numberOfComments: post.numberOfComments - 1,
            })
            if (parentCommentId) {
                cache.modify({
                id: 'CommentNode:' + parentCommentId,
                fields: {
                    numberOfReplies(cachedValue) {
                        return cachedValue - 1
                        }
                    }
                })
            }
            handleAlert('The comment was successfully deleted.', 'success')
        },
        onError: () => {
            handleAlert('An error occured, please try again.', 'danger')
        }
    }
    )

    return (
        <Modal show={showCommentDeleteModal} onHide={() => setShowCommentDeleteModal(false)} centered>
            <Modal.Header closeButton >
                <Modal.Title>Delete Comment</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure want to delete this comment?</Modal.Body>
            <Modal.Footer>
                <Button
                    variant="outline-secondary"
                    onClick={() => setShowCommentDeleteModal(false)} >
                    Close
                </Button>
                <Button
                    onClick={handleDeleteComment}
                    disabled={loadingDeleteComment}
                    variant='warning'>
                    {loadingDeleteComment ?
                        <SpinnerForButton /> :
                        "Delete"
                    }
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
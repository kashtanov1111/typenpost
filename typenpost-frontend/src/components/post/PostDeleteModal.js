import React from "react";
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { POST_DELETING } from "../../gqls/mutations";
import { useMutation } from "@apollo/client";
import { SpinnerForButton } from "../SpinnerForButton";

export function PostDeleteModal({
    postId,
    postUUID,
    handleAlert,
    showPostDeleteModal,
    setShowPostDeleteModal,
}) {
    const [handleDeletePost, {
        loading: loadingDeletePost
    }] = useMutation(
        POST_DELETING, {
        variables: {
            uuid: postUUID
        },
        update(cache) {
            cache.evict({id: 'PostNode:' + postId})
            cache.gc()
            handleAlert('The post was successfully deleted.', 'success')
        },
        onError: () => {
            handleAlert('An error occured, please try again.', 'danger')
        }
    }
    )
    
    return (
        <Modal show={showPostDeleteModal} onHide={() => setShowPostDeleteModal(false)} centered>
            <Modal.Header closeButton >
                <Modal.Title>Log Out</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure want to delete this post?</Modal.Body>
            <Modal.Footer>
                <Button
                    variant="outline-secondary"
                    onClick={() => setShowPostDeleteModal(false)} >
                    Close
                </Button>
                <Button
                    onClick={handleDeletePost}
                    disabled={loadingDeletePost}
                    variant='warning'>
                    {loadingDeletePost ? 
                    <SpinnerForButton /> :
                    "Delete"
                    }
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
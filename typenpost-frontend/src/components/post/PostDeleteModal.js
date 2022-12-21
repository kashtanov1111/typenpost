import { IdContext } from "../../context/LoginContext";
import { POST_DELETING } from "../../gqls/mutations";
import { SpinnerForButton } from "../SpinnerForButton";
import { useMutation } from "@apollo/client";
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

export function PostDeleteModal({
    fromPostDetail,
    handleAlert,
    hasPrevPage,
    postId,
    postUUID,
    setShowPostDeleteModal,
    showPostDeleteModal,
}) {
    const navigate = useNavigate()
    const authenticatedUserId = useContext(IdContext)
    const [handleDeletePost, {
        loading: loadingDeletePost
    }] = useMutation(
        POST_DELETING, {
        variables: {
            uuid: postUUID
        },
        onCompleted: () => {
            if (fromPostDetail) {
                if (hasPrevPage) {
                    navigate(-1)
                } else {
                    navigate('/')
                }
            }
        },
        update(cache) {
            cache.evict({ id: 'PostNode:' + postId })
            cache.gc()
            cache.modify({
                id: 'UserNode:' + authenticatedUserId,
                fields: {
                    numberOfPosts(cachedValue) {
                        return cachedValue - 1
                    }
                }
            })
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
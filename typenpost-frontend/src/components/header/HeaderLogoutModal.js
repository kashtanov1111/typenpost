import React from "react";
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'


export function HeaderLogoutModal({
    showLogoutModal,
    handleCloseLogoutModal,
    handleLogoutButtonClicked
}) {
    return (
        <Modal show={showLogoutModal} onHide={handleCloseLogoutModal} centered>
            <Modal.Header closeButton >
                <Modal.Title>Log Out</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure want to log out?</Modal.Body>
            <Modal.Footer>
                <Button
                    variant="outline-secondary"
                    onClick={handleCloseLogoutModal} >
                    Close
                </Button>
                <Button
                    onClick={handleLogoutButtonClicked}
                    variant='warning'>
                    Log Out
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
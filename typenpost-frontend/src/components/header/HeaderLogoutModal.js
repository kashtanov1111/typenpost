import React from "react";
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'


export function HeaderLogoutModal({
    showLogoutModal,
    setShowLogoutModal,
    handleLogoutButtonClicked
}) {
    return (
        <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} centered>
            <Modal.Header closeButton >
                <Modal.Title>Log Out</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure want to log out?</Modal.Body>
            <Modal.Footer>
                <Button
                    variant="outline-secondary"
                    onClick={() => setShowLogoutModal(false)} >
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
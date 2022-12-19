import logout from '../../assets/images/box-arrow-left.svg'
import React from "react";
import { Link } from 'react-router-dom'
import Accordion from 'react-bootstrap/Accordion'
import Modal from 'react-bootstrap/Modal'
import ListGroup from 'react-bootstrap/ListGroup'
import cursor_text from '../../assets/images/cursor-text.svg'
import fingerprint from '../../assets/images/fingerprint.svg'
import envelope from '../../assets/images/envelope.svg'
import trash3 from '../../assets/images/trash3.svg'
import { createImageSrcUrl } from '../../functions/functions';

export function HeaderSettingsModal({
    showSettingsModal,
    setShowSettingsModal,
    setShowLogoutModal,
    pathname,
    secondaryEmail,
}) {

    function handleCloseSettingsModal() {
        setShowSettingsModal(false)
    }

    return (
        <Modal
            size='sm'
            show={showSettingsModal}
            onHide={handleCloseSettingsModal} centered>
            <Modal.Header closeButton >
                <Modal.Title>Settings</Modal.Title>
            </Modal.Header>
            <ListGroup
                as={Accordion}
                variant='flush'
                className='accordion-flush border-bottom-rounded'>
                <ListGroup.Item
                    action
                    type='button'
                    as={Link}
                    onClick={handleCloseSettingsModal}
                    to='/password_change'>
                    <div className='listgroupitem-settings-modal'>
                        <img src={createImageSrcUrl(fingerprint)} alt="" width='20' height='20' />
                        <span>Change password</span>
                    </div>
                </ListGroup.Item>
                <ListGroup.Item
                    action
                    as={Link}
                    onClick={handleCloseSettingsModal}
                    to='/username_change'>
                    <div className='listgroupitem-settings-modal'>
                        <img src={createImageSrcUrl(cursor_text)} alt="" width='20' height='20' />
                        <span>Change username</span>
                    </div>
                </ListGroup.Item>
                <Accordion.Item className="no-top-border" eventKey='0'>
                    <Accordion.Header>
                        <div className='listgroupitem-settings-modal'>
                            <img src={createImageSrcUrl(envelope)} alt="" width='20' height='20' />
                            <span>Change email</span>
                        </div>
                    </Accordion.Header>
                    <Accordion.Body className='p-0'>
                        <ListGroup.Item
                            className='no-left-right-top-border'
                            as={Link}
                            onClick={handleCloseSettingsModal}
                            to='/add_email'
                            action>
                            <div>
                                Set secondary email
                            </div>
                        </ListGroup.Item>
                        <ListGroup.Item
                            className='no-left-right-top-border'
                            as={Link}
                            onClick={handleCloseSettingsModal}
                            to='/swap_emails'
                            state={pathname}
                            disabled={secondaryEmail === false ? true : false}
                            action>
                            <div>
                                Make secondary email primary
                            </div>
                        </ListGroup.Item>
                        <ListGroup.Item
                            className='no-border'
                            as={Link}
                            onClick={handleCloseSettingsModal}
                            to='/remove_secondary_email'
                            disabled={secondaryEmail === false ? true : false}
                            state={pathname}
                            action>
                            <div>
                                Remove secondary email
                            </div>
                        </ListGroup.Item>
                    </Accordion.Body>
                </Accordion.Item>
                <ListGroup.Item
                    as={Link}
                    onClick={handleCloseSettingsModal}
                    to='/archive_account'
                    state={pathname}
                    action>
                    <div className='listgroupitem-settings-modal'>
                        <img src={createImageSrcUrl(trash3)} alt="" width='20' height='20' />
                        <span>Archive account</span>
                    </div>
                </ListGroup.Item>
                <ListGroup.Item
                    onClick={() => {
                        setShowLogoutModal(true)
                        setShowSettingsModal(false)
                    }}
                    >
                    <div className='listgroupitem-settings-modal'>
                        <img src={createImageSrcUrl(logout)} alt="" height='20' width='20' />
                        <span >Log out</span>
                    </div>
                </ListGroup.Item>
            </ListGroup>
        </Modal>
    )
}
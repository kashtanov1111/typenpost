import React from "react";
import { Link } from 'react-router-dom'
import Accordion from 'react-bootstrap/Accordion'
import Modal from 'react-bootstrap/Modal'
import ListGroup from 'react-bootstrap/ListGroup'
import { RiLockPasswordFill } from 'react-icons/ri'
import { BiRename } from 'react-icons/bi'
import { IoMdAddCircle } from 'react-icons/io'
import { IoMdSwap } from 'react-icons/io'
import { AiFillDelete } from 'react-icons/ai'
import { MdEmail } from 'react-icons/md'

export function HeaderSettingsModal({
    showSettingsModal,
    handleCloseSettingsModal,
    pathname,
    secondaryEmail,
}) {
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
                    <div className='centered-label'>
                        <RiLockPasswordFill />&nbsp;Change password
                    </div>
                </ListGroup.Item>
                <ListGroup.Item
                    action
                    as={Link}
                    onClick={handleCloseSettingsModal}
                    to='/username_change'>
                    <div className='centered-label'>
                        <BiRename />&nbsp;Change username
                    </div>
                </ListGroup.Item>
                <Accordion.Item className="only-top-border" eventKey='0'>
                    <Accordion.Header className='innerBtn'>
                        <div className='centered-label'>
                            <MdEmail />&nbsp;Change email
                        </div>
                    </Accordion.Header>
                    <Accordion.Body className='p-0'>
                        <ListGroup.Item
                            className='no-left-right-top-border'
                            as={Link}
                            onClick={handleCloseSettingsModal}
                            to='/add_email'
                            action>
                            <div className='centered-label'>
                                &nbsp;&nbsp;<IoMdAddCircle />
                                &nbsp;Set secondary email
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
                            <div className='centered-label'>
                                &nbsp;&nbsp;<IoMdSwap />
                                &nbsp;Make secondary email primary
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
                            <div className='centered-label'>
                                &nbsp;&nbsp;<AiFillDelete />
                                &nbsp;Remove secondary email
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
                    <div className='centered-label'>
                        <AiFillDelete />&nbsp;Archive account
                    </div>
                </ListGroup.Item>
            </ListGroup>
        </Modal>
    )
}
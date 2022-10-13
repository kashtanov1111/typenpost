import React, {useState} from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom'

import long_logo from '../assets/images/long_logo.jpg';
import nobody from '../assets/images/nobody.jpg'

import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Dropdown from 'react-bootstrap/Dropdown'
import Modal from 'react-bootstrap/Modal'
import ListGroup from 'react-bootstrap/ListGroup'
import { RiLockPasswordLine } from 'react-icons/ri'
import { BiRename } from 'react-bootstrap/bi'

import { CustomToggle } from '../CustomToggle'

import ProgressiveImage from 'react-progressive-graceful-image'

import { 
  createImageSrcUrl, 
  createImagePlaceholderUrl } from '../functions/functions'


export function Header(props) {
    const navigate = useNavigate()
    const location = useLocation()
    const pathname = location.pathname
    const {
      avatar, 
      username,
      id, 
      isAuthenticated, 
      handleLogout, 
      handleAlert} = props
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showSettingsModal, setShowSettingsModal] = useState(false)

    const handleClose = () => setShowDeleteModal(false)
    const handleCloseSettingsModal = () => setShowSettingsModal(false)
    const handleShow = () => setShowDeleteModal(true)
    const handleShowSettingsModal = () => setShowSettingsModal(true)

    function handleButtonClick() {
        setShowDeleteModal(false)
        handleLogout()
        handleAlert('You have signed out.', 'success')
    }
    return (
      <div>
      <Navbar bg="white" expand="lg" className='py-0'>
      <Container>
          <Navbar.Brand as={Link} to='/' className='me-2'>
            <ProgressiveImage 
              src={createImageSrcUrl(long_logo)} 
              placeholder={createImagePlaceholderUrl(long_logo, '20x20')}>
              {(src, loading) => 
                <img 
                  style={{filter: loading && 'blur(8px}', 
                          'WebkitFilter': loading && 'blur(8px)'}} 
                  height='40px' 
                  src={src} 
                  alt="Logo" />}
            </ProgressiveImage>
          </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to='/'>Home</Nav.Link>
            <Nav.Link as={Link} to='/create'>Create</Nav.Link>
          </Nav>
          <Form className="d-flex mb-lg-0 mb-2">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
          </Form>
          {isAuthenticated ? 
            <Dropdown>
              <Dropdown.Toggle 
                as={CustomToggle} 
                id="dropdown-menu-align-responsive-1">
              <span className="d-block link-dark text-decoration-none 
                dropdown-toggle" >
                <ProgressiveImage 
                  src={avatar ? avatar : nobody} 
                  placeholder={avatar ? 
                    createImagePlaceholderUrl(avatar, '16x16') : nobody}>
                  {(src, loading) => 
                    <img 
                      style={{filter: loading && 'blur(8px}', 
                        'WebkitFilter': loading && 'blur(8px)'}} 
                      height='32' 
                      width='32' 
                      className="rounded-circle" 
                      src={src} 
                      alt="mdo" />}
                </ProgressiveImage>
              </span>
              </Dropdown.Toggle>

              <Dropdown.Menu align={{lg: 'end'}}>
                <Dropdown.Item
                  as={Link}
                  to={'/profile/' + id}
                  active={pathname === '/profile/' + id}>
                  {username}
                </Dropdown.Item>
                <Dropdown.Item 
                  onClick={handleShowSettingsModal}
                  active={
                    pathname.startsWith('/password_change') ||
                    pathname.startsWith('/username_change')
                      }>
                    Settings
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={handleShow}>
                  Log out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> :
            <div>
                <Button 
                  as={Link} 
                  to='/login'
                  state={location.pathname}
                  variant='outline-dark'
                  className="me-2">
                  Log In
                </Button>
                <Button 
                  as={Link} 
                  to='/register' 
                  variant='primary'>
                  Sign Up
                </Button>
            </div>
          }
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <Modal show={showDeleteModal} onHide={handleClose} centered>
      <Modal.Header closeButton >
          <Modal.Title>Log Out</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure want to log out?</Modal.Body>
      <Modal.Footer>
          <Button 
              variant="outline-secondary"
              onClick={handleClose} >
              Close
          </Button>
          <Button 
              onClick={handleButtonClick} 
              variant='warning'>
              Log Out
          </Button>
      </Modal.Footer>
    </Modal>
    <Modal
      size='sm' 
      show={showSettingsModal} 
      onHide={handleCloseSettingsModal} centered>
      <Modal.Header closeButton >
          <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
        <ListGroup variant='flush' className='border-bottom-rounded'>
          <ListGroup.Item 
            action
            as={Link}
            onClick={handleCloseSettingsModal} 
            to='/password_change'><RiLockPasswordLine /> Change password</ListGroup.Item>
          <ListGroup.Item
            action
            as={Link}
            onClick={handleCloseSettingsModal}
            to='/username_change'><BiRename /> Change username</ListGroup.Item>
          <ListGroup.Item
            action>Add secondary email</ListGroup.Item>
          <ListGroup.Item
            action>Make secondary email primary</ListGroup.Item>
          <ListGroup.Item
            action>Delete secondary email</ListGroup.Item>
          <ListGroup.Item
            action>Delete account</ListGroup.Item>
        </ListGroup>
    </Modal>
</div>
    )
}
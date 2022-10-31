import React, {useState, useRef, useEffect} from "react";
import { Link, useLocation } from 'react-router-dom'

import long_logo from '../assets/images/long_logo.jpg';
import nobody from '../assets/images/nobody.jpg'

import Container from 'react-bootstrap/Container'
import Accordion from 'react-bootstrap/Accordion'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Dropdown from 'react-bootstrap/Dropdown'
import Modal from 'react-bootstrap/Modal'
import ListGroup from 'react-bootstrap/ListGroup'
import { RiLockPasswordFill } from 'react-icons/ri'
import { BiRename } from 'react-icons/bi'
import { IoMdAddCircle } from 'react-icons/io'
import { IoMdSwap } from 'react-icons/io' 
import { AiFillDelete } from 'react-icons/ai' 
import { MdEmail } from 'react-icons/md' 


import { CustomToggle } from '../CustomToggle'

import ProgressiveImage from 'react-progressive-graceful-image'

import { 
  createImageSrcUrl, 
  createImagePlaceholderUrl } from '../functions/functions'


export function Header(props) {
    const location = useLocation()
    const pathname = location.pathname
    const {
      avatar, 
      username,
      isAuthenticated,
      secondaryEmail, 
      handleLogout, 
      clickedOutsideNavbar,
      handleAlert} = props
    const containerNavbar = useRef(null)
    
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showSettingsModal, setShowSettingsModal] = useState(false)

    const handleClose = () => setShowDeleteModal(false)
    const handleCloseSettingsModal = () => setShowSettingsModal(false)
    const handleShow = () => setShowDeleteModal(true)
    const handleShowSettingsModal = () => setShowSettingsModal(true)
    const [expanded, setExpanded] = useState(false);

    function handleButtonClick() {
        setShowDeleteModal(false)
        handleLogout()
        handleAlert('You have signed out.', 'success')
    }
    useEffect(() => {
      if (expanded === true) {
        setExpanded(false)
      }
    }, [clickedOutsideNavbar])

    return (
      <div>
      <Navbar expanded={expanded} bg="white" expand="lg" className='py-0'>
      <Container ref={containerNavbar} className='bottom-border pb-md-0'>
          <Navbar.Brand as={Link} to='/' className='me-2'>
            <ProgressiveImage 
              src={createImageSrcUrl(long_logo)} 
              placeholder={createImagePlaceholderUrl(long_logo, '20x20')}>
              {(src, loading) => 
                <img 
                  style={{filter: loading && 'blur(8px}', 
                          'WebkitFilter': loading && 'blur(8px)'}} 
                  height='40px' 
                  onClick={() => setExpanded(false)}
                  src={src} 
                  alt="Logo" />}
            </ProgressiveImage>
          </Navbar.Brand>
        <Navbar.Toggle className='no-border' aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />
        <Navbar.Collapse  id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} onClick={() => setExpanded(false)} to='/'>Home</Nav.Link>
            <Nav.Link as={Link} onClick={() => setExpanded(false)} to='/create'>Create</Nav.Link>
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
            <Dropdown className='mb-md-0 mb-2'>
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
                  to={'/profile/' + username}
                  onClick={() => setExpanded(false)}
                  active={pathname === '/profile/' + username}>
                  {username}
                </Dropdown.Item>
                <Dropdown.Item 
                  onClick={() => {
                    setExpanded(false)
                    handleShowSettingsModal()
                  }}
                  active={
                    pathname.startsWith('/password_change') ||
                    pathname.startsWith('/username_change')
                      }>
                    Settings
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setExpanded(false)
                    handleShow()}}>
                  Log out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> :
            <div className='mb-md-0 mb-2'>
                <Button 
                  as={Link} 
                  to='/login'
                  state={location.pathname}
                  onClick={() => setExpanded(false)}
                  variant='outline-dark'
                  className="me-2">
                  Log In
                </Button>
                <Button 
                  as={Link} 
                  to='/register' 
                  onClick={() => setExpanded(false)}
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
        <ListGroup as={Accordion} variant='flush' className='accordion-flush border-bottom-rounded'>
          
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
                  &nbsp;&nbsp;<IoMdAddCircle />&nbsp;Set secondary email
                  </div>
                  </ListGroup.Item>
                <ListGroup.Item 
                  className='no-left-right-top-border'
                  as={Link}
                  onClick={handleCloseSettingsModal}
                  to='/swap_emails'
                  state={pathname}
                  disabled={secondaryEmail ? false : true}
                  action>
                  <div className='centered-label'>
                  &nbsp;&nbsp;<IoMdSwap />&nbsp;Make secondary email primary
                  </div>
                </ListGroup.Item>
                <ListGroup.Item
                  className='no-border'
                  as={Link}
                  onClick={handleCloseSettingsModal}
                  to='/remove_secondary_email'
                  disabled={secondaryEmail ? false : true}
                  state={pathname}
                  action>
                  <div className='centered-label'>
                  &nbsp;&nbsp;<AiFillDelete />&nbsp;Remove secondary email
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
</div>
    )
}
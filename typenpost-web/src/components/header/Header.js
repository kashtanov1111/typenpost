import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useLocation } from 'react-router-dom'
import long_logo from '../../assets/images/long_logo.jpg';
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { HeaderSettingsModal } from "./HeaderSettingsModal";
import { HeaderLogoutModal } from "./HeaderLogoutModal";
import { HeaderDropdown } from "./HeaderDropdown";
import ProgressiveImage from 'react-progressive-graceful-image'
import {
  createImageSrcUrl,
  createImagePlaceholderUrl
} from '../../functions/functions'
import { IsAuthContext } from "../../context/LoginContext";

export function Header(props) {
  const {
    avatar,
    secondaryEmail,
    handleLogout,
    handleAlert } = props
  const location = useLocation()
  const pathname = location.pathname
  const isAuthenticated = useContext(IsAuthContext)

  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [expanded, setExpanded] = useState(false);
  const navbarRef = useRef(null)

  const handleCloseLogoutModal = () => setShowLogoutModal(false)
  const handleShowLogoutModal = () => setShowLogoutModal(true)
  const handleCloseSettingsModal = () => setShowSettingsModal(false)
  const handleShowSettingsModal = () => setShowSettingsModal(true)

  useEffect(() => {
    function handleClickOutside(event) {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setExpanded(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navbarRef]);

  function handleLogoutButtonClicked() {
    setShowLogoutModal(false)
    handleLogout()
    handleAlert('You have signed out.', 'success')
  }

  return (
    <div ref={navbarRef}>
      <Navbar expanded={expanded} bg="white" expand="lg" className='py-0'>
        <Container className='bottom-border pb-md-0'>
          <Navbar.Brand as={Link} to='/' className='me-2'>
            <ProgressiveImage
              src={createImageSrcUrl(long_logo)}
              placeholder={createImagePlaceholderUrl(long_logo, '20x20')}>
              {(src, loading) =>
                <img
                  style={{
                    filter: loading && 'blur(8px}',
                    'WebkitFilter': loading && 'blur(8px)'
                  }}
                  height='40px'
                  onClick={() => setExpanded(false)}
                  src={src}
                  alt="Logo" />}
            </ProgressiveImage>
          </Navbar.Brand>
          <Navbar.Toggle 
            className='no-border' 
            aria-controls="basic-navbar-nav" 
            onClick={() => setExpanded(!expanded)} />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} onClick={() => setExpanded(false)} to='/'>
                Home
              </Nav.Link>
              <Nav.Link as={Link} onClick={() => setExpanded(false)} to='/create'>
                Create
              </Nav.Link>
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
              <HeaderDropdown
                avatar={avatar}
                setExpanded={setExpanded}
                handleShowSettingsModal={handleShowSettingsModal}
                pathname={pathname}
                handleShowLogoutModal={handleShowLogoutModal}
              />
              :
              <div className='mb-md-0 mb-2'>
                <Button
                  as={Link}
                  to='/login'
                  state={pathname}
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
      <HeaderLogoutModal
        showLogoutModal={showLogoutModal}
        handleCloseLogoutModal={handleCloseLogoutModal}
        handleLogoutButtonClicked={handleLogoutButtonClicked}
      />
      <HeaderSettingsModal
        showSettingsModal={showSettingsModal}
        handleCloseSettingsModal={handleCloseSettingsModal}
        pathname={pathname}
        secondaryEmail={secondaryEmail}
      />
    </div>
  )
}
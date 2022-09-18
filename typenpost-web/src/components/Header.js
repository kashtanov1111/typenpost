import long_logo from '../assets/images/long_logo.jpg';
import nobody from '../assets/images/nobody.jpg'
import React from "react";
import { Link, useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Dropdown from 'react-bootstrap/Dropdown'
import { CustomToggle } from './CustomToggle'
import ProgressiveImage from 'react-progressive-graceful-image'
import { createPlaceholderUrl } from './App';
import { createSrcUrl } from './App';

export function Header(props) {
    const navigate = useNavigate()
    const {username, isAuthenticated, 
          avatar} = props
    
    return (
      <div>
      <Navbar bg="white" expand="lg" className='py-0'>
      <Container>
          <Navbar.Brand as={Link} to='/' className='me-2'>
            <ProgressiveImage src={createSrcUrl(long_logo)} placeholder={createPlaceholderUrl(long_logo, '20x20')}>
              {(src, loading) => <img style={{filter: loading && 'blur(8px}', 'WebkitFilter': loading && 'blur(8px)'}} height='40px' src={src} alt="Logo" />}
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
                <ProgressiveImage src={avatar ? avatar : nobody} placeholder={avatar ? createPlaceholderUrl(avatar, '16x16') : nobody}>
                  {(src, loading) => <img style={{filter: loading && 'blur(8px}', 'WebkitFilter': loading && 'blur(8px)'}} height='32' width='32' className="rounded-circle" src={src} alt="mdo" />}
                </ProgressiveImage>
              </span>
              </Dropdown.Toggle>

              <Dropdown.Menu align={{lg: 'end'}}>
                <Dropdown.Item>{username}</Dropdown.Item>
                <Dropdown.Item 
                  as={Link}
                  to='/password_change'>
                    Change password
                </Dropdown.Item>
                <Dropdown.Item
                  as={Link} 
                  to='/logout'>
                  Log out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> :
            <div>
                <Button 
                  as={Link} 
                  to='/login' 
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
</div>
    )
}
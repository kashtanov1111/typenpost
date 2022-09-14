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

export function Header(props) {
    const navigate = useNavigate()
    const {username, isAuthenticated, 
          avatar, handleLogout} = props

    const aws_link = "https://typenpost.s3.amazonaws.com"
    return (
      <div>
      <Navbar bg="white" expand="lg" className='py-0'>
      <Container>
          <Navbar.Brand as={Link} to='/' className='me-2'>
            <img height='40px' src={aws_link + long_logo} alt="Logo" />
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
                <img 
                  src={avatar ? avatar : nobody} 
                  alt="mdo" 
                  width="32" 
                  height="32" 
                  className="rounded-circle" />
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
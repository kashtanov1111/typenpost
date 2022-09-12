import long_logo from '../long_logo.JPG';
import nobody from '../images/nobody.jpg'
import React from "react";
import { Link, useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import Dropdown from 'react-bootstrap/Dropdown'
import { CustomToggle } from './CustomToggle'

export function Header(props) {
    const navigate = useNavigate()
    const {username, isAuthenticated, 
          avatar, handleLogout} = props
    return (
      <div>
      <Navbar bg="white" expand="lg" className='py-0'>
      <Container>
          <Navbar.Brand className='me-2'>
            <Link to="/" >
            <img className="long-logo" src={long_logo} alt="Logo" />
            </Link>
          </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to='/'>Home</Nav.Link>
            <Nav.Link as={Link} to='/create'>Create</Nav.Link>
          </Nav>
          <Form className="d-flex mb-lg-0 mb-3 ">
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
                <Link 
                  type="button" 
                  to='/login' 
                  className="btn btn-outline-dark me-2">
                  Log In
                </Link>
                <Link 
                  type="button" 
                  to='/register' 
                  className="btn btn-primary">
                  Sign Up
                </Link>
            </div>
          }
        </Navbar.Collapse>
      </Container>
    </Navbar>
</div>
    )
}
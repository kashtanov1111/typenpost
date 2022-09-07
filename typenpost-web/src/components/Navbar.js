import long_logo from '../long_logo.JPG';
import nobody from '../images/nobody.jpg'
import React from "react";
import { Link, useNavigate } from 'react-router-dom'
import { gql, useMutation } from '@apollo/client';


export function Navbar(props) {
    const navigate = useNavigate()
    const {username, isAuthenticated, 
          avatar, handleLogout} = props
    return (
      <nav className="navbar sticky-top navbar-expand-lg bg-white py-0">
  <div className="container">
    <Link className="navbar-brand" to="/">
      <img className="long-logo" src={long_logo} alt="Logo" />
    </Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <Link className="nav-link active" aria-current="page" to="/">Home</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/create">Create</Link>
        </li>
      </ul>
      <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
      </form>
      { isAuthenticated ?
      <div className="flex-shrink-0 dropdown">
          <a href="#" className="d-block link-dark text-decoration-none dropdown-toggle" id="dropdownUser2" data-bs-toggle="dropdown" aria-expanded="false">
            <img src={avatar ? avatar : nobody} alt="mdo" width="32" height="32" className="rounded-circle" />
          </a>
          <ul className="dropdown-menu dropdown-menu-end text-small shadow" aria-labelledby="dropdownUser2">
            <li><a className="dropdown-item" href="#">{username}</a></li>
            <li><a className="dropdown-item" href="#">Settings</a></li>
            <li><Link type='link' className="dropdown-item" to='/password_change'>Change password</Link></li>
            <li><a className="dropdown-item" href="#">Profile</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item" onClick={handleLogout}>Log out</a></li>
          </ul>
      </div> :
      <div>
          <Link type="button" to='/login' className="btn btn-outline-dark me-2">Log In</Link>
          <Link type="button" to='/register' className="btn btn-primary">Sign Up</Link>
      </div>}
    </div>
  </div>
</nav>
    )
}
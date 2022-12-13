import React, { useState, useContext } from 'react'

import { IsAuthContext } from '../../context/LoginContext'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export function NewHeader() {
    const isAuthenticated = useContext(IsAuthContext)
    const navigate = useNavigate()
    const location = useLocation()
    const pathname = location.pathname

    return (isAuthenticated === true ?
        <header className='header-auth'>
            <nav className='header-auth__nav'>
                <div className='logo'></div>
                <ul className='header-auth__ul'>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </nav>
        </header>
        :
        <header className='header-unauth'>
            <p className='header-unauth__p'></p>
            <div className='header-unauth__btns'>
                <button
                    className='header-unauth__btn'
                    onClick={() => navigate(
                        '../login', {
                        replace: true,
                        state: pathname
                    })}
                >
                Log in
                </button>
                <button
                    className='header-unauth__btn'
                    as={Link}
                    to='/register'
                >Sign up
                </button>
            </div>
        </header>
    )
}
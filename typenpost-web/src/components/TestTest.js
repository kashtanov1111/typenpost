import React, { useState, useContext } from 'react'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'
import { IsAuthContext, UsernameContext } from '../context/LoginContext'
export function TestTest({ handleLogout }) {
    const [count, setCount] = useState(0)
    const isAuthenticated = useContext(IsAuthContext)
    const username = useContext(UsernameContext)
    return (
        <>
            <h1>test</h1>
            {isAuthenticated ? 'yes' : 'no'}
            {username ? username : 'no username'}
            <Button
                as={Link}
                to='/login'
                variant='outline-dark'
                className="me-2">
                Log In
            </Button>
            <Button
                onClick={() => handleLogout()}
                variant='outline-dark'
                className="me-2">
                Log out
            </Button>
            <button onClick={() => {
                return setCount(count + 1)
            }}>{count}</button>
            {/* <button onClick={() => setCountB(countB + 1)}>{countB}</button> */}
        </>
    )
}
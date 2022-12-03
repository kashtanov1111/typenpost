import React, { useState, useEffect, useContext } from "react"
import { useMutation } from "@apollo/client"
import { useNavigate } from "react-router-dom"

import { useTitle } from '../../customHooks/hooks'

import { Error } from "../Error"

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import { SpinnerForButton } from "../SpinnerForButton"
import { Loader } from "../Loader"

import { USERNAME_CHANGE } from "../../gqls/mutations"
import { IsAuthContext } from "../../context/LoginContext"

export function UsernameChange({ handleAlert, handleLogout }) {
    const isAuthenticated = useContext(IsAuthContext)
    const navigate = useNavigate()
    useTitle('Typenpost - Change Username')

    const [newUsername, setNewUsername] = useState('')

    const [handleUsernameChange, { data, loading, error }] = useMutation(
        USERNAME_CHANGE, {
        variables: { username: newUsername.toLowerCase() },
        onCompleted: async (data) => {
            if (data.usernameChange.success) {
                handleAlert(
                    'Your username has been changed. Please log in.',
                    'success')
                await handleLogout()
                navigate('../login', { replace: true })
            }
        }
    }
    )

    const usernameError = data &&
        data.usernameChange.errors &&
        data.usernameChange.errors.username
    console.log('usernameError', usernameError)
    useEffect(() => {
        if (isAuthenticated === false) {
            navigate('../login', { replace: true, state: '/username_change' })
        }
    }, [isAuthenticated, navigate])

    function handleUsernameType(e) {
        const reg = /^[A-Za-z0-9._]*$/
        if (reg.test(e.target.value)) {
            setNewUsername(e.target.value)
        }
    }

    if (error) {
        return <Error />
    }

    if (isAuthenticated === null) {
        return <Loader />
    }

    return (
        <Row>
            <Col md={6} className='mx-auto'>
                <h1 className='text-center mt-2 mb-3'>Change Username</h1>
                <Form onSubmit={(event) => {
                    event.preventDefault()
                    handleUsernameChange()
                }}>
                    <Form.Group className='mb-3'>
                        <FloatingLabel
                            label='Username'
                            controlId='floatingUsername'
                        >
                            <Form.Control
                                type="text"
                                maxLength={20}
                                isInvalid={usernameError}
                                value={newUsername}
                                onChange={(e) =>
                                    handleUsernameType(e)
                                }
                                disabled={loading}
                                placeholder='Username'
                                required
                            />
                            {usernameError &&
                                <Form.Control.Feedback type='invalid'>
                                    {usernameError[0]}
                                </Form.Control.Feedback>
                            }
                        </FloatingLabel>
                    </Form.Group>
                    <Button
                        variant='primary'
                        className='login-signup-button py-2 col-12 mb-2'
                        type='submit'
                        disabled={!newUsername || loading}
                    >
                        {loading ?
                            <SpinnerForButton /> :
                            <b>Save</b>
                        }
                    </Button>
                </Form>
            </Col>
        </Row>
    )
}
import React, { useEffect, useState, useContext } from "react";
import { useMutation } from "@apollo/client";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { SpinnerForButton } from "../SpinnerForButton";
import { Error } from "../Error";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from "react-bootstrap/Button";
import { HideShowButton } from "../HideShowButton";
import { useTitle } from '../../customHooks/hooks'
import { LogoBanner } from "../LogoBanner";
import { LOGIN_MUTATION } from "../../gqls/mutations";
import { IsAuthContext } from "../../context/LoginContext";
import Alert from 'react-bootstrap/Alert'

export function Login({ handleAlert, queryMe, setIsAuthenticated }) {
    const navigate = useNavigate()
    const isAuthenticated = useContext(IsAuthContext)
    const location = useLocation()
    useTitle('Typenpost - Log In')

    const [showPassword, setShowPassword] = useState(false)
    const [formState, setFormState] = useState({
        usernameOrEmail: '',
        password: '',
    })
    const [handleLogin, { data, loading, error }] = useMutation(
        LOGIN_MUTATION
        , {
            onCompleted: (data) => {
                if (data.tokenAuth.success) {
                    // console.log('LOGIN MUTATION completed and succeed')
                    handleAlert(
                        'Successfully signed in as ' +
                        formState.usernameOrEmail.toLowerCase(), 'success')
                    if (location.state) {
                        if (
                            location.state.startsWith('/login') ||
                            location.state.startsWith('/register') ||
                            location.state.startsWith('/password_reset') ||
                            location.state.startsWith('/activate')
                        ) {
                            navigate('../', { replace: true })
                        } else {
                            navigate(
                                '..' + location.state, { replace: true })
                        }
                    } else {
                        navigate('../', { replace: true })
                    }
                    queryMe()
                    setIsAuthenticated(true)
                }
            }
        }
    )

    useEffect(() => {
        if (isAuthenticated) {
            navigate('../', { replace: true })
        }
    }, [isAuthenticated, navigate])

    function handleUsernameOrEmailInput() {
        if (formState.usernameOrEmail.includes('@')) {
            return 'Email'
        } else if (formState.usernameOrEmail === '') {
            return 'Username or Email'
        } else {
            return 'Username'
        }
    }
    function handleShowPassword() {
        if (showPassword === true) {
            setShowPassword(false)
        } else {
            setShowPassword(true)
        }
    }
    function handleSubmit(event) {
        event.preventDefault()
        setShowPassword(false)
        var variables = { password: formState.password }
        if (handleUsernameOrEmailInput() === 'Email') {
            variables.email = formState.usernameOrEmail.toLowerCase()
        } else {
            variables.username = formState.usernameOrEmail.toLowerCase()
        }
        handleLogin({ variables: variables })
    }

    if (error) {
        return <Error />
    }

    console.log('Render Login Component')

    return (
        <>
            <Row>
                <Col md={6} className='mx-auto'>
                    <LogoBanner />
                    <h1 className='text-center mt-3 mb-3'>
                        Log in
                    </h1>
                    {data && !data.tokenAuth.success &&
                        data.tokenAuth.errors.nonFieldErrors.map((el) => (
                            <Alert key='danger' variant='danger'>
                                {el.message}
                            </Alert>
                        ))
                    }
                    <Form
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        <Form.Group className='mb-3 show-password'>
                            <FloatingLabel
                                label={handleUsernameOrEmailInput()}
                                controlId='floatingInput'
                            >
                                <Form.Control
                                    type="text"
                                    value={formState.usernameOrEmail}
                                    onChange={(e) =>
                                        setFormState({
                                            ...formState,
                                            usernameOrEmail: e.target.value,

                                        })
                                    }
                                    disabled={loading}
                                    placeholder={handleUsernameOrEmailInput()}
                                    required
                                />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className='mb-3 show-password'>
                            <FloatingLabel
                                label='Password'
                                controlId='floatingPassword'
                            >
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    value={formState.password}
                                    onChange={(e) =>
                                        setFormState({
                                            ...formState,
                                            password: e.target.value
                                        })
                                    }
                                    disabled={loading}
                                    placeholder='Password'
                                    required
                                />
                            <HideShowButton
                                handleShowPassword={handleShowPassword}
                                password={formState.password}
                                showPassword={showPassword} />
                            </FloatingLabel>
                        </Form.Group>
                        <Button
                            type='submit'
                            variant='primary'
                            className='big-button py-2 col-12 mb-2'
                            disabled={!(formState.usernameOrEmail &&
                                formState.password) || loading}>
                            {loading ?
                                <SpinnerForButton /> :
                                <b>Log In</b>
                            }
                        </Button>
                        <div className='text-center'>
                            <Link
                                type="link"
                                className='a'
                                to='/password_reset'
                                state={(handleUsernameOrEmailInput() === 'Email') ?
                                    formState.usernameOrEmail :
                                    ''}>
                                Forgot Account?
                            </Link>
                            <span> ∙ </span>
                            <Link
                                type="link"
                                className='a'
                                to='/register'>
                                Sign up
                            </Link>
                        </div>
                    </Form>
                </Col>
            </Row>
        </>
    )
}
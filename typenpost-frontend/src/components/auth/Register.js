import { AlertContext } from '../../context/AlertContext';
import { Error } from "../Error";
import { HideShowButton } from "../HideShowButton";
import { IsAuthContext } from "../../context/LoginContext";
import { Link, useNavigate } from "react-router-dom";
import { REGISTER_MUTATION } from "../../gqls/mutations";
import { RegisterMade } from "./RegisterMade";
import { SpinnerForButton } from "../SpinnerForButton";
import { useMutation } from "@apollo/client";
import { useTitle } from '../../customHooks/useTitle'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Form from 'react-bootstrap/Form'
import React, { useState, useEffect, useContext } from "react";
import Row from 'react-bootstrap/Row'
import { useScrollTop } from '../../customHooks/useScrollTop';

export function Register() {
    useScrollTop()
    const handleAlert = useContext(AlertContext)
    const isAuthenticated = useContext(IsAuthContext)
    const navigate = useNavigate()
    useTitle('Typenpost - Sign up')

    const [showPassword1, setShowPassword1] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)
    const [formState, setFormState] = useState({
        username: '',
        email: '',
        password1: '',
        password2: '',
    })

    const [handleRegister, { data, loading, error }] = useMutation(
        REGISTER_MUTATION, {
        variables: {
            email: formState.email.toLowerCase(),
            username: formState.username.toLowerCase(),
            password1: formState.password1,
            password2: formState.password2,
        },
        onCompleted: (data) => {
            console.log(data)
            if (data.register.success) {
                const message = 'Confirmation e-mail sent to ' +
                    formState.email
                handleAlert(message, 'primary')
            }
        }
    })

    const emailError = data && data.register.errors && data.register.errors.email
    const usernameError = data && data.register.errors && data.register.errors.username
    const passwordError = data && data.register.errors && data.register.errors.password2
    const isPasswordMismatchError =
        passwordError && passwordError[0].code === 'password_mismatch'


    useEffect(() => {
        if (isAuthenticated === true) {
            navigate('../', { replace: true })
        }
    }, [isAuthenticated, navigate])

    function handleSubmit(event) {
        event.preventDefault()
        setShowPassword1(false)
        setShowPassword2(false)
        handleRegister()
    }

    function handleUsernameChange(e) {
        const reg = /^[a-zA-Z0-9._]*$/
        if (reg.test(e.target.value)) {
            setFormState({
                ...formState,
                username: e.target.value
            })
        }
    }

    if (error) {
        return (
            <Error />
        )
    }

    return (isAuthenticated === false) &&
        <>{(data === undefined || data.register.errors && 0) ?
            <Row>
                <Col md={6} className='mx-auto' >
                    <h1 className='text-center mt-2 mb-3'>
                        Sign up
                    </h1>
                    <Form
                        onSubmit={handleSubmit}
                        noValidate>
                        <Form.Group className='mb-2'>
                            <FloatingLabel
                                label='Email address'
                                controlId='floatingEmail'
                            >
                                <Form.Control
                                    type="email"
                                    value={formState.email}
                                    isInvalid={emailError}
                                    isValid={data && !emailError}
                                    onChange={(e) =>
                                        setFormState({
                                            ...formState,
                                            email: e.target.value
                                        })
                                    }
                                    disabled={loading}
                                    placeholder='Email address'
                                    required
                                />
                                <Form.Control.Feedback>
                                    Looks good!
                                </Form.Control.Feedback>
                                {emailError &&
                                    <Form.Control.Feedback type='invalid'>
                                        {emailError[0].message}
                                    </Form.Control.Feedback>
                                }
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className='mb-2'>
                            <FloatingLabel
                                label='Username'
                                controlId='floatingUsername'
                            >

                                <Form.Control
                                    type="text"
                                    isInvalid={
                                        usernameError || 
                                        formState.username.length > 20}
                                    isValid={data && !usernameError}
                                    value={formState.username}
                                    onChange={(e) =>
                                        handleUsernameChange(e)
                                    }
                                    // maxLength={20}
                                    disabled={loading}
                                    placeholder='Username'
                                    required
                                />
                                <Form.Control.Feedback>
                                    Looks good!
                                </Form.Control.Feedback>
                                {usernameError &&
                                    <Form.Control.Feedback type='invalid'>
                                        {usernameError[0].message}
                                    </Form.Control.Feedback>
                                }
                                {formState.username.length > 20 &&
                                    <Form.Control.Feedback type='invalid'>
                                        Must not exceed 20 characters.
                                    </Form.Control.Feedback>}
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className='mb-2 show-password'>
                            <FloatingLabel
                                label='Password'
                                controlId='floatingPassword1'
                            >
                                <Form.Control
                                    type={showPassword1 ? "text" : "password"}
                                    value={formState.password1}
                                    isInvalid={passwordError &&
                                        !isPasswordMismatchError}
                                    isValid={data && !passwordError}
                                    onChange={(e) =>
                                        setFormState({
                                            ...formState,
                                            password1: e.target.value
                                        })
                                    }
                                    disabled={loading}
                                    placeholder='Password'
                                    required
                                />
                                <HideShowButton
                                    handleShowPassword={() => setShowPassword1(!showPassword1)}
                                    password={formState.password1}
                                    showPassword={showPassword1}
                                    showValidation={data !== undefined}
                                />
                                <Form.Control.Feedback>
                                    Looks good!
                                </Form.Control.Feedback>
                                {passwordError && passwordError.map(
                                    (el) => (
                                        <Form.Control.Feedback
                                            key={el.message} type='invalid'>
                                            {el.message}
                                        </Form.Control.Feedback>
                                    )
                                )}
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className='mb-2 show-password'>
                            <FloatingLabel
                                label='Password (again)'
                                controlId='floatingPassword2'
                            >
                                <Form.Control
                                    type={showPassword2 ? "text" : "password"}
                                    value={formState.password2}
                                    isInvalid={passwordError}
                                    isValid={data && !passwordError}
                                    onChange={(e) =>
                                        setFormState({
                                            ...formState,
                                            password2: e.target.value
                                        })
                                    }
                                    disabled={loading}
                                    placeholder='Password (again)'
                                    required
                                />
                                <HideShowButton
                                    handleShowPassword={() => setShowPassword2(!showPassword2)}
                                    password={formState.password2}
                                    showPassword={showPassword2}
                                    showValidation={data !== undefined}
                                />
                                <Form.Control.Feedback>
                                    Looks good!
                                </Form.Control.Feedback>
                                {passwordError &&
                                    isPasswordMismatchError &&
                                    <Form.Control.Feedback type='invalid'>
                                        {passwordError[0].message}
                                    </Form.Control.Feedback>
                                }
                            </FloatingLabel>
                        </Form.Group>
                        <Button
                            variant='primary'
                            className='big-button py-2 col-12 mb-2'
                            type='submit'
                            disabled={!(formState.email &&
                                formState.username &&
                                formState.password1 &&
                                formState.password2) || loading ||
                                formState.username.length > 20}
                        >
                            {loading ?
                                <SpinnerForButton /> :
                                <b>Sign up</b>
                            }
                        </Button>
                        <div className='text-center'>
                            <Link type="link" to='/login' className='a'>
                                Already have an account?
                            </Link>
                        </div>
                    </Form>
                </Col>
            </Row> :
            <RegisterMade
                formState={formState}
                handleAlert={handleAlert}
            />
        }</>
}
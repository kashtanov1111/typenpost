import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; 
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Spinner from 'react-bootstrap/Spinner'
import { useTitle } from "./App";
import { Error } from "./Error";

const REGISTER_MUTATION = gql`
    mutation register(
        $username: String!
        $email: String!
        $password1: String!
        $password2: String!
    ) {
        register(
            username: $username
            email: $email
            password1: $password1
            password2: $password2
        ) {
            success
            errors
        }
    }
`

const RESEND_ACTIVATION_EMAIL = gql`
    mutation ResendActivationEmail($email: String!) {
        resendActivationEmail(email: $email) {
            success
            errors
        }
    }
`

export function Register(props) {
    useTitle('Typenpost - Sign up')
    const {handleAlert} = props
    const navigate = useNavigate()
    const [registered, setRegistered] = useState(false)
    const [formState, setFormState] = useState({
        username: '',
        email: '',
        password1: '',
        password2: '',
    })
    const [handleRegister, {
                            data: dataRegister, 
                            loading: loadingRegister,
                            error: errorRegister}] = useMutation(
        REGISTER_MUTATION, {
        variables: {
            email: formState.email,
            username: formState.username,
            password1: formState.password1,
            password2: formState.password2,
        },
        onCompleted: (data) => {
            if (data.register.success) {
                const message = 'Confirmation e-mail sent to ' + formState.email
                handleAlert(message, 'primary')
                setRegistered(true)
            }
        }
    })
    const [handleResend, {
                        loading: loadingResendEmail,
                        error: errorResendEmail}] = useMutation(RESEND_ACTIVATION_EMAIL, {
        variables: {
            email: formState.email
        }, 
        onCompleted: (data) => {
            if (data.resendActivationEmail.success) {
                const message = 'Confirmation e-mail has been resent to ' + formState.email
                handleAlert(message, 'primary')
            }
        }
    })
    function handleSubmit(event) {
        event.preventDefault()
        handleRegister()
    }
    if (errorRegister || errorResendEmail) {
        return (
            <Error />
        )
    }
    return (!registered ?
        <Row>
        <Col md={6} className='mx-auto' >
            <h1 className='text-center mb-3'>
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
                            isInvalid={dataRegister && dataRegister.register.errors.email}
                            isValid={dataRegister && !dataRegister.register.errors.email}
                            onChange={(e) => 
                                setFormState({
                                    ...formState,
                                    email: e.target.value
                                })
                            }
                            placeholder='Email address'
                            required
                        />    
                        <Form.Control.Feedback>
                            Looks good!
                        </Form.Control.Feedback>
                        {dataRegister && 
                        dataRegister.register.errors.email &&
                        dataRegister.register.errors.email.map((el) => (
                        <Form.Control.Feedback type='invalid'>
                                {el.message}
                        </Form.Control.Feedback>
                        ))}
                    </FloatingLabel>
                </Form.Group>
                <Form.Group className='mb-2'>
                    <FloatingLabel
                        label='Username'
                        controlId='floatingUsername'
                    >

                        <Form.Control 
                            type="text"
                            isInvalid={dataRegister && dataRegister.register.errors.username}
                            isValid={dataRegister && !dataRegister.register.errors.username}
                            value={formState.username}
                            onChange={(e) => 
                                setFormState({
                                    ...formState,
                                    username: e.target.value
                                })
                            }
                            placeholder='Username'
                            required
                        />    
                        <Form.Control.Feedback>
                            Looks good!
                        </Form.Control.Feedback>
                        {dataRegister && 
                        dataRegister.register.errors.username &&
                        dataRegister.register.errors.username.map((el) => (
                        <Form.Control.Feedback type='invalid'>
                                {el.message}
                        </Form.Control.Feedback>
                        ))}
                    </FloatingLabel>
                </Form.Group>
                <Form.Group className='mb-2'>
                    <FloatingLabel
                        label='Password'
                        controlId='floatingPassword1'
                    >
                        <Form.Control 
                            type="password"
                            value={formState.password1}
                            isInvalid={dataRegister && dataRegister.register.errors.password1}
                            isValid={dataRegister && !dataRegister.register.errors.password1}
                            onChange={(e) => 
                                setFormState({
                                    ...formState,
                                    password1: e.target.value
                                })
                            }
                            placeholder='Password'
                            required
                        />    
                        <Form.Control.Feedback>
                            Looks good!
                        </Form.Control.Feedback>
                        {dataRegister && 
                        dataRegister.register.errors.password1 &&
                        dataRegister.register.errors.password1.map((el) => (
                        <Form.Control.Feedback type='invalid'>
                                {el.message}
                        </Form.Control.Feedback>
                        ))}
                    </FloatingLabel>
                </Form.Group>
                <Form.Group className='mb-2'>
                    <FloatingLabel
                        label='Password (again)'
                        controlId='floatingPassword2'
                    >
                        <Form.Control 
                            type="password"
                            value={formState.password2}
                            isInvalid={dataRegister && dataRegister.register.errors.password2}
                            isValid={dataRegister && !dataRegister.register.errors.password2}
                            onChange={(e) => 
                                setFormState({
                                    ...formState,
                                    password2: e.target.value
                                })
                            }
                            placeholder='Password (again)'
                            required
                        />    
                        <Form.Control.Feedback>
                            Looks good!
                        </Form.Control.Feedback>
                        {dataRegister && 
                        dataRegister.register.errors.password2 &&
                        dataRegister.register.errors.password2.map((el) => (
                        <Form.Control.Feedback type='invalid'>
                                {el.message}
                        </Form.Control.Feedback>
                        ))}
                    </FloatingLabel>
                </Form.Group>
                <Button 
                    variant='primary' 
                    className='login-signup-button py-2 col-12 mb-2' 
                    type='submit'
                    disabled={!(formState.email &&
                                formState.username &&
                                formState.password1 &&
                                formState.password2)}
                                >
                    {loadingRegister ? 
                    <div><Spinner
                        as='span'
                        animation='border'
                        size='sm'
                        role='status'
                        aria-hidden='true' />
                    <span className='visually-hidden'>Loading...</span>
                    </div> :
                    <b>Sign up</b>
                    }
                </Button>
                <div className='text-center'>
                    <Link type="link" to='/login'>
                        Already have an account?
                    </Link>
                </div>
            </Form>
        </Col>
        </Row> :
        <Row>
            <Col md={8} className='mx-auto'>
            <h1 className='text-center'>Verify Your E-mail Address</h1>
            <p>We have sent an e-mail to you for verification. 
            Follow the link provided to finalize the signup process. 
            If you do not see the verification e-mail in your main inbox,
             check your spam folder. Please contact us 
             if you do not receive the verification e-mail within
              a few minutes.</p>
            <Row className='justify-content-md-center'>
                <Col xs='auto'>
                    Is Confirmation email not coming?
                </Col>
                <Col xs='auto'>
                    <Button 
                        onClick={handleResend}
                        variant='primary'
                        >
                        {loadingResendEmail ? 
                        <div><Spinner
                            as='span'
                            animation='border'
                            size='sm'
                            role='status'
                            aria-hidden='true' />
                        <span className='visually-hidden'>Loading...</span>
                        </div> :
                        <span>Resend</span>
                    }
                    </Button>

                </Col>
            </Row>
            </Col>
        </Row>
    )
}
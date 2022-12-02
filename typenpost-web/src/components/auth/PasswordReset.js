import React, { useState, useEffect, useContext } from "react"
import { useMutation } from "@apollo/client"
import { useLocation } from "react-router-dom"

import { useTitle } from '../../customHooks/hooks'
import { Loader } from "../Loader"
import { Error } from "../Error"
import { useNavigate } from "react-router-dom"

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'

import { SEND_PASSWORD_RESET_EMAIL } from "../../gqls/mutations"
import { IsAuthContext } from "../../context/LoginContext"
import { SpinnerForButton } from "../SpinnerForButton"

export function PasswordReset() {
    console.log('PasswordReset render')
    
    const isAuthenticated = useContext(IsAuthContext)
    const navigate = useNavigate()
    const location = useLocation()
    useTitle('Typenpost - Password Reset')

    const [email, setEmail] = useState(
        location.state ? location.state : '')

    const [handleEmail, { data, loading, error }] = useMutation(
        SEND_PASSWORD_RESET_EMAIL, {
        variables: { email: email }
    }
    )

    const emailError =
        data &&
        data.sendPasswordResetEmail.errors &&
        data.sendPasswordResetEmail.errors.email

    useEffect(() => {
        if (isAuthenticated === true) {
            navigate('../', { replace: true })
        }
    }, [isAuthenticated, navigate])

    if (error) {
        return <Error />
    }

    if (isAuthenticated === null) {
        return <Loader />
    }

    return ((isAuthenticated === false) &&
        <Row>
            <Col md={6} className='mx-auto'>
                {(data === undefined || data.sendPasswordResetEmail.errors) ? <div>
                    <h1 className='text-center mt-2 mb-3'>Password Reset</h1>
                    <p>
                        Forgotten your password?
                        Enter your e-mail address below,
                        and we'll send you an e-mail allowing you to reset it.
                    </p>
                    <Form
                        onSubmit={(event) => {
                            event.preventDefault()
                            handleEmail()
                        }}
                        noValidate
                    >
                        <Row>
                            <Col md >
                                <Form.Group className='mb-2 pe-0'>
                                    <FloatingLabel
                                        label='Email'
                                        controlId='floatingEmail'
                                    >
                                        <Form.Control
                                            type="email"
                                            value={email}
                                            isInvalid={emailError}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            placeholder='Email'
                                            disabled={loading}
                                            required
                                        />
                                        {emailError &&
                                            <Form.Control.Feedback type='invalid'>
                                                {emailError[0].message}
                                            </Form.Control.Feedback>
                                        }
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col md='auto' className='px-md-0'>
                                <Button
                                    variant='primary'
                                    className='login-signup-button py-2 col-12'
                                    type='submit'
                                    disabled={!email || loading}
                                >
                                    {loading ?
                                        <SpinnerForButton /> :
                                        <>Send</>
                                    }
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </div> :
                    <div>
                        <h1 className='text-center mt-2 mb-3'>Password Reset</h1>
                        <p>
                            We have sent you an e-mail.
                            If you have not received it
                            please check your spam folder.
                            Otherwise contact us if you do not receive it
                            in a few minutes.
                        </p>
                    </div>}
            </Col>
        </Row>
    )
}

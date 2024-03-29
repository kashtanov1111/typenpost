import { AlertContext } from '../../context/AlertContext';
import { Error } from "../Error"
import { HideShowButton } from "../HideShowButton"
import { IsAuthContext } from "../../context/LoginContext"
import { SEND_SECONDARY_EMAIL_ACTIVATION } from "../../gqls/mutations"
import { SpinnerForButton } from "../SpinnerForButton"
import { useMutation } from "@apollo/client"
import { useNavigate } from "react-router-dom"
import { useTitle } from '../../customHooks/useTitle'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Form from 'react-bootstrap/Form'
import React, { useState, useEffect, useContext } from "react"
import Row from 'react-bootstrap/Row'
import { useScrollTop } from '../../customHooks/useScrollTop';

export function AddSecondaryEmail({ email }) {
    console.log('AddSecondaryEmail render')
    
    const handleAlert = useContext(AlertContext)
    const isAuthenticated = useContext(IsAuthContext)
    const navigate = useNavigate()
    useTitle('Typenpost - Add secondary email')
    useScrollTop()

    const [showPassword, setShowPassword] = useState(false)
    const [formState, setFormState] = useState({
        email: '',
        password: '',
    })
    const [handleAddSecondaryEmail, { data, loading, error }] =
        useMutation(SEND_SECONDARY_EMAIL_ACTIVATION, {
            variables: {
                email: formState.email,
                password: formState.password
            },
            onCompleted: (data) => {
                if (data.sendSecondaryEmailActivation.success) {
                    const message =
                        'Confirmation e-mail sent to ' +
                        formState.email
                    handleAlert(message, 'primary')
                }
            }
        }
        )

    const emailError = data &&
        data.sendSecondaryEmailActivation.errors &&
        data.sendSecondaryEmailActivation.errors.email
    const passwordError = data &&
        data.sendSecondaryEmailActivation.errors &&
        data.sendSecondaryEmailActivation.errors.password

    useEffect(() => {
        if (isAuthenticated === false) {
            navigate('../login', { replace: true, state: '/add_email' })
        }
    }, [isAuthenticated, navigate])

    if (error) {
        return <Error />
    }

    return (isAuthenticated === true && <>
        {(data === undefined || data.sendSecondaryEmailActivation.errors) ?
            <Row>
                <Col md={6} className='mx-auto'>
                    <h1 className='text-center mt-2 mb-3'>Set Secondary Email</h1>
                    <Form onSubmit={(event) => {
                        event.preventDefault()
                        setShowPassword(false)
                        handleAddSecondaryEmail()
                    }}>
                        <Form.Group className='mb-2'>
                            <FloatingLabel
                                label='Primary Email'
                                controlId='floatingPrimaryEmail'
                            >
                                <Form.Control
                                    type="email"
                                    value={email}
                                    placeholder='Primary Email'
                                    disabled
                                    required
                                />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className='mb-2'>
                            <FloatingLabel
                                label='Secondary Email'
                                controlId='floatingEmail'
                            >
                                <Form.Control
                                    type="email"
                                    isInvalid={emailError}
                                    value={formState.email}
                                    onChange={(e) =>
                                        setFormState({
                                            ...formState,
                                            email: e.target.value,
                                        })
                                    }
                                    disabled={loading}
                                    placeholder='Secondary Email'
                                    required
                                />
                                {emailError &&
                                    <Form.Control.Feedback type='invalid'>
                                        {emailError[0].message}
                                    </Form.Control.Feedback>
                                }
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className='mb-2 show-password'>
                            <FloatingLabel
                                label='Password'
                                controlId='floatingPassword'
                            >
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    value={formState.password}
                                    isInvalid={passwordError}
                                    isValid={data && !passwordError}
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
                                <Form.Control.Feedback>
                                    Looks good!
                                </Form.Control.Feedback>
                                {passwordError &&
                                    <Form.Control.Feedback type='invalid'>
                                        {passwordError[0].message}
                                    </Form.Control.Feedback>
                                }
                                <HideShowButton
                                    handleShowPassword={() => setShowPassword(!showPassword)}
                                    password={formState.password}
                                    showPassword={showPassword}
                                    showValidation={data !== undefined}
                                />
                            </FloatingLabel>
                        </Form.Group>
                        <Button
                            variant='primary'
                            className='big-button py-2 col-12 mb-2'
                            type='submit'
                            disabled={!(formState.email &&
                                formState.password) || loading}>
                            {loading ?
                                <SpinnerForButton /> :
                                <b>Save</b>
                            }
                        </Button>
                    </Form>
                </Col>
            </Row> :
            <Row>
                <Col md={8} className='mx-auto'>
                    <h1 className='my-2'>Verify Your New E-mail Address</h1>
                    <p>We have sent an e-mail to you for verification.
                        Follow the link provided to finalize the process.
                        If you do not see the verification e-mail in your main inbox,
                        check your spam folder. Please contact us
                        if you do not receive the verification e-mail within
                        a few minutes.</p>
                </Col>
            </Row>}</>
    )
}
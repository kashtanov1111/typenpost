import React, { useState, useEffect, useContext } from "react"
import { useMutation } from "@apollo/client"
import { useParams, useNavigate } from "react-router-dom"
import Alert from 'react-bootstrap/Alert'
import { useTitle } from '../../customHooks/hooks'
import { Loader } from "../Loader"
import { Error } from "../Error"

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import { SpinnerForButton } from "../SpinnerForButton"
import { LogoBanner } from "../LogoBanner"
import { HideShowButton } from "../HideShowButton"

import { PASSWORD_RESET } from "../../gqls/mutations"
import { IsAuthContext } from "../../context/LoginContext"

export function PasswordResetWithToken(props) {
    console.log('PasswordResetWithToken render')

    const { handleAlert } = props
    const isAuthenticated = useContext(IsAuthContext)
    const params = useParams()
    const token = params.confirmationToken
    const navigate = useNavigate()
    useTitle('Typenpost - Password Reset')

    const [showPassword1, setShowPassword1] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)
    const [formState, setFormState] = useState({
        newPassword1: '',
        newPassword2: ''
    })

    const [handlePasswordChange, { data, loading, error }] = useMutation(
        PASSWORD_RESET, {
        variables: {
            token: token,
            newPassword1: formState.newPassword1,
            newPassword2: formState.newPassword2
        },
        onCompleted: (data) => {
            console.log(data)
            if (data.passwordReset.success) {
                handleAlert(
                    'Your password has been reset. Thank you!',
                    'success')
                navigate('../login', { replace: true })
            }
        }
    }
    )

    const newPassword2errors = data && data.passwordReset.errors.newPassword2
    const isPasswordMismatchError =
        newPassword2errors && newPassword2errors[0].code === 'password_mismatch'

    useEffect(() => {
        if (isAuthenticated === true) {
            navigate('../', { replace: true })
        }
    }, [isAuthenticated, navigate])

    if (error) {
        return <Error />
    }

    return ((isAuthenticated === false) &&
        <Row>
            <Col md={6} className='mx-auto' >
                <LogoBanner />
                <h1 className='text-center mt-2 mb-3'>Reset Your Password</h1>
                {data && !data.passwordReset.success &&
                    data.passwordReset.errors.nonFieldErrors.map((el) => (
                        <Alert key='danger' variant='danger'>
                            {el.message}
                        </Alert>
                    ))
                }
                <Form onSubmit={(event) => {
                    event.preventDefault()
                    setShowPassword1(false)
                    setShowPassword2(false)
                    handlePasswordChange()
                }}>
                    <Form.Group className='mb-3'>
                        <FloatingLabel
                            label='New password'
                            controlId='floatingPassword1'
                        >
                            <Form.Control
                                type={showPassword1 ? "text" : "password"}
                                value={formState.newPassword1}
                                isInvalid={data && !isPasswordMismatchError}
                                onChange={(e) =>
                                    setFormState({
                                        ...formState,
                                        newPassword1: e.target.value
                                    })
                                }
                                disabled={loading}
                                placeholder='New password'
                                required
                            />
                            <HideShowButton
                                handleShowPassword={() => setShowPassword1(!showPassword1)}
                                password={formState.newPassword1}
                                showPassword={showPassword1}
                                showValidation={data !== undefined}
                            />
                            {newPassword2errors &&
                                newPassword2errors.map((el) => (
                                    <Form.Control.Feedback
                                        key={el.message} type='invalid'>
                                        {el.message}
                                    </Form.Control.Feedback>
                                ))}
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <FloatingLabel
                            label='New password (again)'
                            controlId='floatingPassword2'
                        >
                            <Form.Control
                                type={showPassword2 ? "text" : "password"}
                                value={formState.newPassword2}
                                isInvalid={data}
                                onChange={(e) =>
                                    setFormState({
                                        ...formState,
                                        newPassword2: e.target.value
                                    })
                                }
                                disabled={loading}
                                placeholder='New password (again)'
                                required
                            />
                            {isPasswordMismatchError &&
                                <Form.Control.Feedback type='invalid'>
                                    {newPassword2errors[0].message}
                                </Form.Control.Feedback>
                            }
                            <HideShowButton
                                handleShowPassword={() => setShowPassword2(!showPassword2)}
                                password={formState.newPassword2}
                                showPassword={showPassword2}
                                showValidation={data !== undefined}
                            />
                        </FloatingLabel>
                    </Form.Group>
                    <Button
                        variant='primary'
                        className='big-button py-2 col-12 mb-2'
                        type='submit'
                        disabled={!(formState.newPassword1 &&
                            formState.newPassword2) || loading}
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
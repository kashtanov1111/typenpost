import { AlertContext } from '../../context/AlertContext';
import { Error } from "../Error"
import { HideShowButton } from "../HideShowButton"
import { IsAuthContext } from "../../context/LoginContext"
import { REMOVE_SECONDARY_EMAIL } from "../../gqls/mutations"
import { SpinnerForButton } from "../SpinnerForButton"
import { useMutation } from "@apollo/client"
import { useNavigate, useLocation } from "react-router-dom"
import { useTitle } from '../../customHooks/useTitle'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Form from 'react-bootstrap/Form'
import React, { useState, useEffect, useContext } from "react"
import Row from 'react-bootstrap/Row'
import { useScrollTop } from '../../customHooks/useScrollTop';

export function RemoveSecondaryEmail({ secondaryEmail, queryMe }) {
    console.log('Remove secondary email render')
    
    useScrollTop()
    const handleAlert = useContext(AlertContext)
    const isAuthenticated = useContext(IsAuthContext)
    const navigate = useNavigate()
    const location = useLocation()
    useTitle('Typenpost - Remove Secondary Email')

    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const [handleRemoveSecondaryEmail, { data, error, loading }] =
        useMutation(REMOVE_SECONDARY_EMAIL, {
            variables: { password: password },
            onCompleted: (data) => {
                if (data.removeSecondaryEmail.success) {
                    handleAlert('Secondary email was successfully removed.',
                        'success')
                    if (location.state === null) {
                        navigate('../', { replace: true })
                    } else {
                        navigate('..' + location.state, { replace: true })
                    }
                    queryMe()
                }
            }
        }
        )

    const passwordError = data &&
        data.removeSecondaryEmail.errors &&
        data.removeSecondaryEmail.errors.password

    useEffect(() => {
        if (isAuthenticated === false) {
            navigate('../login',
                { replace: true, state: '/remove_secondary_email' })
        }
    }, [isAuthenticated, navigate])

    useEffect(() => {
        if (secondaryEmail === false && isAuthenticated === true) {
            navigate('../', { replace: true })
        }
    }, [isAuthenticated, secondaryEmail, navigate])

    if (error) {
        return <Error />
    }

    return (isAuthenticated === true && secondaryEmail &&
        <Row>
            <Col md={6} className='mx-auto'>
                <h1 className='text-center mt-2 mb-3'>
                    Remove Secondary Email
                </h1>
                <Form onSubmit={(event) => {
                    event.preventDefault()
                    setShowPassword(false)
                    handleRemoveSecondaryEmail()
                }}>
                    <Form.Group className='mb-3'>
                        <FloatingLabel
                            label='Password'
                            controlId='floatingPassword'
                        >
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                value={password}
                                isInvalid={passwordError}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                disabled={loading}
                                placeholder='Password'
                                required
                            />
                            {passwordError &&
                                <Form.Control.Feedback type='invalid'>
                                    {passwordError[0].message}
                                </Form.Control.Feedback>
                            }
                            <HideShowButton
                                handleShowPassword={() => setShowPassword(!showPassword)}
                                password={password}
                                showPassword={showPassword}
                                showValidation={data !== undefined}
                            />
                        </FloatingLabel>
                    </Form.Group>
                    <Button
                        variant='primary'
                        className='big-button py-2 col-12 mb-2'
                        type='submit'
                        disabled={!password || loading}>
                        {loading ?
                            <SpinnerForButton /> :
                            <b>Remove</b>
                        }
                    </Button>
                </Form>
            </Col>
        </Row>
    )
}

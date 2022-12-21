import { AlertContext } from '../../context/AlertContext';
import { Error } from "../Error"
import { HideShowButton } from "../HideShowButton";
import { IsAuthContext } from "../../context/LoginContext"
import { SpinnerForButton } from "../SpinnerForButton"
import { SWAP_EMAILS } from "../../gqls/mutations"
import { useMutation } from "@apollo/client"
import { useNavigate, useLocation } from "react-router-dom"
import { useTitle } from '../../customHooks/useTitle'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form'
import React, { useState, useEffect, useContext } from "react"
import Row from 'react-bootstrap/Row'

export function SwapEmails({ secondaryEmail }) {
    const isAuthenticated = useContext(IsAuthContext)
    const handleAlert = useContext(AlertContext)
    const navigate = useNavigate()
    const location = useLocation()
    useTitle('Typenpost - Swap Emails')

    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const [handleSwapEmails, { data, error, loading }] = useMutation(
        SWAP_EMAILS, {
        variables: { password: password },
        onCompleted: (data) => {
            if (data.swapEmails.success) {
                handleAlert('Emails were successfully swapped.', 'success')
                if (location.state === null) {
                    navigate('../', { replace: true })
                } else {
                    navigate('..' + location.state, { replace: true })
                }
            }
        }
    }
    )

    const passwordError = data && 
        data.swapEmails.errors &&
        data.swapEmails.errors.password

    useEffect(() => {
        if (isAuthenticated === false) {
            navigate('../login',
                { replace: true, state: '/swap_emails' })
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
                <h1 className='text-center mb-3'>Swap Emails</h1>
                <Form onSubmit={(event) => {
                    event.preventDefault()
                    setShowPassword(false)
                    handleSwapEmails()
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
                                placeholder='Password'
                                disabled={loading}
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
                            <b>Swap</b>
                        }
                    </Button>
                </Form>
            </Col>
        </Row>
    )
}

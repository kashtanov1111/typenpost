import { AlertContext } from '../../context/AlertContext';
import { ARCHIVE_ACCOUNT } from "../../gqls/mutations"
import { Error } from "../Error"
import { HideShowButton } from "../HideShowButton"
import { IsAuthContext } from "../../context/LoginContext"
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


export function ArchiveAccount({ handleLogout }) {
    console.log('ArchiveAccount render')
    
    const handleAlert = useContext(AlertContext)
    const isAuthenticated = useContext(IsAuthContext)
    const navigate = useNavigate()
    useTitle('Typenpost - Archive Account')

    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const [handleArchiveAccount, { data, error, loading }] = useMutation(
        ARCHIVE_ACCOUNT, {
        variables: { password: password },
        onCompleted: async (data) => {
            console.log(data)
            if (data.archiveAccount.success) {
                await handleLogout()
                handleAlert('You have successfully archived your account.',
                    'success')
                navigate('../login', { replace: true })
            }
        }
    }
    )

    const passwordError = data && data.archiveAccount.errors.password

    useEffect(() => {
        if (isAuthenticated === false) {
            navigate('../login',
                { replace: true, state: '/archive_account' })
        }
    }, [isAuthenticated, navigate])

    if (error) {
        return <Error />
    }

    return (isAuthenticated === true &&
        <Row>
            <Col md={6} className='mx-auto'>
                <h1 className='my-2'>Archive Account</h1>
                <p className='pb-2'>You are about to archive your Typenpost account.
                    All information related to your account will
                    no longer be viewable on Typenpost. Your username
                    will be saved and no one will be able to take it.
                    You can easily restore your account with all related
                    information by logging in again in the future.</p>
                <Form onSubmit={(event) => {
                    event.preventDefault()
                    setShowPassword(false)
                    handleArchiveAccount()
                }}>
                    <Form.Group className='mb-3 show-password'>
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
                        variant='danger'
                        className='big-button py-2 col-12 mb-3'
                        type='submit'
                        disabled={!password || loading}>
                        {loading ?
                            <SpinnerForButton /> :
                            <b>Archive</b>
                        }
                    </Button>
                </Form>
            </Col>
        </Row>
    )
}

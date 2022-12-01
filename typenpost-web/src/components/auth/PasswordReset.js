import React, {useState, useEffect, useContext} from "react"
import { useMutation } from "@apollo/client"
import { useLocation } from "react-router-dom"

import { useTitle } from '../../customHooks/hooks'

import { Error } from "../Error"
import { useNavigate } from "react-router-dom"

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Spinner from 'react-bootstrap/Spinner'

import { SEND_PASSWORD_RESET_EMAIL } from "../../gqls/mutations"
import { IsAuthContext } from "../../context/LoginContext"

export function PasswordReset() {
    const isAuthenticated = useContext(IsAuthContext)
    const navigate = useNavigate()
    const location = useLocation()
    useTitle('Typenpost - Password Reset')

    const [email, setEmail] = useState(
        location.state ? location.state : '')
    const [emailSent, setEmailSent] = useState(false)


    const [handleEmail, {data, loading, error}] = useMutation(
        SEND_PASSWORD_RESET_EMAIL, {
            variables: {email: email},
            onCompleted: (data) => {
                if (data.sendPasswordResetEmail.success) {
                    setEmailSent(true)
                }
                
            } 
        }
    )

    useEffect(() => {
        if (isAuthenticated) {
            navigate('../', {replace: true})
        }
    }, [isAuthenticated])

    if (error) {
        return <Error />
    }

    return (
        <Row>
            <Col md={6} className='mx-auto'>
                {!emailSent ? <div>
                <h1 className='text-center'>Password Reset</h1>
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
                            isInvalid={data && 
                                data.sendPasswordResetEmail.errors.email}
                            isValid={data && 
                                !data.sendPasswordResetEmail.errors.email}
                            onChange={(e) => 
                                setEmail(e.target.value)
                            }
                            placeholder='Email'
                            required
                        />    
                        <Form.Control.Feedback>
                            Looks good!
                        </Form.Control.Feedback>
                        {data && 
                        data.sendPasswordResetEmail.errors.email &&
                        data.sendPasswordResetEmail.errors.email.map((el) => (
                        <Form.Control.Feedback
                            key={el.message} type='invalid'>
                                {el.message}
                        </Form.Control.Feedback>
                        ))}
                    </FloatingLabel>
                </Form.Group>
                </Col>
                <Col md='auto' className='px-md-0'>
                <Button
                    variant='primary' 
                    className='login-signup-button py-2 col-12' 
                    type='submit'
                    disabled={!email}
                                >
                    {loading ? 
                    <div><Spinner
                        as='span'
                        animation='border'
                        size='sm'
                        role='status'
                        aria-hidden='true' />
                    <span className='visually-hidden'>Loading...</span>
                    </div> :
                    <>Send</>
                    }
                </Button>
                </Col>
                </Row>
                </Form>
                </div> :
                <div>
                    <h1 className='text-center'>Password Reset</h1>
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

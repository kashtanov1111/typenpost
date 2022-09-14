import { gql, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Spinner from 'react-bootstrap/Spinner'
import { useTitle } from "./App";
import { Error } from "./Error";
import InputGroup from 'react-bootstrap/InputGroup'
import {BsFillEyeFill} from 'react-icons/bs'
import {BsFillEyeSlashFill} from 'react-icons/bs'

const LOGIN_MUTATION = gql`
    mutation tokenAuth(
        $username: String
        $email: String
        $password: String!
    ) {
        tokenAuth(
            username: $username
            password: $password
            email: $email
        ) {
            success
            errors
        }
    }
`

export function Login(props) {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [theFirstField, setTheFirstField] = useState('Username or Email')
    useTitle('Typenpost - Log In')
    const {handleAlert} = props
    const [formState, setFormState] = useState({
        usernameOrEmail: '',
        password: '',
    })

    const [handleLogin, { data, loading, error }] = useMutation(
        LOGIN_MUTATION, {
        onCompleted: (data) => {  
            if (data.tokenAuth.success) {
                handleAlert('Successfully signed in as ' + formState.usernameOrEmail, 'success')
                navigate('../', {replace: true})
                localStorage.setItem('refreshToken', JSON.stringify('yes'))
            }
        } 
    })
    useEffect(() => {
        if (formState.usernameOrEmail.includes('@')) {
            setTheFirstField('Email')
        } else if (formState.usernameOrEmail === '') {
            setTheFirstField('Username or Email')
        } else {
            setTheFirstField('Username')
        }
    }, [formState.usernameOrEmail, theFirstField])
    if (error) {
        return <Error />
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
        const variablesEmail = {
            email: formState.usernameOrEmail,
            password: formState.password
        }
        const variablesUsername = {
            username: formState.usernameOrEmail,
            password: formState.password
        }
        if (theFirstField === 'Email') {
            handleLogin({variables: variablesEmail})
        } else {
            handleLogin({variables: variablesUsername})
        }
    }
    return (
        <Row>
            <Col md={6} className='mx-auto'>
            <h1 className='text-center mb-3'>
                Log In
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
                <Form.Group className='mb-3'>
                    <FloatingLabel 
                        label={theFirstField} 
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
                            placeholder={theFirstField}
                            required
                        />
                    </FloatingLabel>
                </Form.Group>
                <InputGroup className='mb-3'>
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
                            placeholder='Password'
                            required
                        />
                    </FloatingLabel>
                    <InputGroup.Text onClick={handleShowPassword} className='juju px-3' id="basic-addon1">
                        {showPassword ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}
                    </InputGroup.Text>
                </InputGroup>
                <Button 
                    type='submit' 
                    variant='primary' 
                    className='login-signup-button py-2 col-12 mb-2'
                    disabled={!(formState.usernameOrEmail && 
                                formState.password)}>
                    {loading ? 
                    <div><Spinner
                        as='span'
                        animation='border'
                        size='sm'
                        role='status'
                        aria-hidden='true' />
                    <span className='visually-hidden'>Loading...</span>
                    </div> :
                    <b>Log In</b>
                    }
                </Button>
                <div className='text-center'>
                    <Link 
                        type="link" 
                        to='/password_reset'
                        state={theFirstField === 'Email' ? 
                                formState.usernameOrEmail :
                                ''}>
                        Forgot Account?
                    </Link>
                    <span> ∙ </span>
                    <Link 
                        type="link" 
                        to='/register'>
                        Sign up
                    </Link>
                </div>
            </Form>
            </Col>
        </Row>
    )
}
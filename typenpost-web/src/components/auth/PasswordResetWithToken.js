import React, {useState, useEffect, useContext} from "react"
import { useMutation } from "@apollo/client"
import { useParams, useNavigate } from "react-router-dom"

import { useTitle } from '../../customHooks/hooks'

import { Error } from "../Error"

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Spinner from 'react-bootstrap/Spinner'
import InputGroup from 'react-bootstrap/InputGroup'
import {BsEye} from 'react-icons/bs'
import {BsEyeSlash} from 'react-icons/bs'

import { PASSWORD_RESET } from "../../gqls/mutations"
import { IsAuthContext } from "../../context/LoginContext"

export function PasswordResetWithToken(props) {
    const {handleAlert} = props
    const isAuthenticated = useContext(IsAuthContext)
    const params = useParams()
    const token = params.confirmationToken
    const navigate = useNavigate()
    useTitle('Typenpost - Password Reset')

    const [showPassword1, setShowPassword1] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)
    const [formState, setFormState] = useState({newPassword1: '', 
                                                newPassword2: ''})
                                                
    const [handlePasswordChange, { data, loading, error }] = useMutation(
        PASSWORD_RESET, {
            variables: { 
                token: token, 
                newPassword1: formState.newPassword1,
                newPassword2: formState.newPassword2 },
            onCompleted: (data) => {
                if (data.passwordReset.success) {
                    handleAlert(
                        'Your password has been reset. Thank you!', 
                        'success')
                    navigate('../login', {replace: true})
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

    function handleShowPassword(number) {
        if (number === 1) {
            if (showPassword1 === true) {
                setShowPassword1(false)
            } else {
                setShowPassword1(true)
            }
        } else if (number === 2) {
            if (showPassword2 === true) {
                setShowPassword2(false)
            } else {
                setShowPassword2(true)
            }
        }
    }

    return (
        <Row>
        <Col md={6} className='mx-auto' > 
            <h1 className='text-center mb-3'>Reset Your Password</h1>
            <Form onSubmit={(event) => {
                event.preventDefault()
                setShowPassword1(false)
                setShowPassword2(false)
                handlePasswordChange()
            }}>
            <InputGroup className='mb-3'>
                <FloatingLabel
                    label='New password'
                    controlId='floatingPassword1'
                >
                    <Form.Control 
                        type={showPassword1 ? "text" : "password"}
                        value={formState.newPassword1}
                        isInvalid={data && 
                            data.passwordReset.errors.newPassword1}
                        isValid={data && 
                            !data.passwordReset.errors.newPassword1}
                        onChange={(e) => 
                            setFormState({
                                ...formState,
                                newPassword1: e.target.value
                            })
                        }
                        placeholder='New password'
                        required
                    />    
                    <Form.Control.Feedback>
                        Looks good!
                    </Form.Control.Feedback>
                    {data && 
                    data.passwordReset.errors.newPassword1 &&
                    data.passwordReset.errors.newPassword1.map((el) => (
                    <Form.Control.Feedback
                        key={el.message} type='invalid'>
                            {el.message}
                    </Form.Control.Feedback>
                    ))}
                </FloatingLabel>
                <InputGroup.Text 
                        onClick={() => handleShowPassword(1)} 
                        className='juju px-3' 
                        id="basic-addon1">
                        {showPassword1 ? <BsEye /> : 
                        <BsEyeSlash />}
                </InputGroup.Text>
            </InputGroup>
            <InputGroup className='mb-3'>
                <FloatingLabel
                    label='New password (again)'
                    controlId='floatingPassword2'
                >
                    <Form.Control 
                        type={showPassword2 ? "text" : "password"}
                        value={formState.newPassword2}
                        isInvalid={data && 
                            data.passwordReset.errors.newPassword2}
                        isValid={data && 
                            !data.passwordReset.errors.newPassword2}
                        onChange={(e) => 
                            setFormState({
                                ...formState,
                                newPassword2: e.target.value
                            })
                        }
                        placeholder='New password (again)'
                        required
                    />    
                    <Form.Control.Feedback>
                        Looks good!
                    </Form.Control.Feedback>
                    {data && 
                    data.passwordReset.errors.newPassword2 &&
                    data.passwordReset.errors.newPassword2.map((el) => (
                    <Form.Control.Feedback
                        key={el.message} type='invalid'>
                            {el.message}
                    </Form.Control.Feedback>
                    ))}
                </FloatingLabel>
                <InputGroup.Text 
                        onClick={() => handleShowPassword(2)} 
                        className='juju px-3' 
                        id="basic-addon2">
                        {showPassword2 ? <BsEye /> : 
                        <BsEyeSlash />}
                    </InputGroup.Text>
            </InputGroup>
            <Button 
                variant='primary' 
                className='login-signup-button py-2 col-12 mb-2' 
                type='submit'
                disabled={!(formState.newPassword1 &&
                            formState.newPassword2)}
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
                <b>Save</b>
                }
            </Button>
        </Form>
        </Col>
        </Row>
    )
}
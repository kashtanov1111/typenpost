import React, {useState, useEffect, useContext} from "react"
import { useMutation } from "@apollo/client"
import { useNavigate} from "react-router-dom"

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

import { PASSWORD_CHANGE } from "../../gqls/mutations"
import { IsAuthContext } from "../../context/LoginContext"

export function PasswordChange(props) {
    const {handleAlert, handleLogout} = props
    const isAuthenticated = useContext(IsAuthContext)
    
    const navigate = useNavigate()
    useTitle('Typenpost - Password Change')
    
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showPassword1, setShowPassword1] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)
    const [formState, setFormState] = useState({oldPassword: '',
                                                newPassword1: '', 
                                                newPassword2: ''})
                                                
    const [handlePasswordChange, { data, loading, error }] = useMutation(
        PASSWORD_CHANGE, {
        variables: { oldPassword: formState.oldPassword, 
                    newPassword1: formState.newPassword1,
                    newPassword2: formState.newPassword2 },
        onCompleted: (data) => {
                if (data.passwordChange.success) {
                    handleAlert(
                        'Your password has been changed. Please log in.', 
                        'success')
                    handleLogout()
                    navigate('../login', {replace: true})
                }
            }
        }
    )

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('../login', {replace: true, state: '/password_change'})
        }
    }, [isAuthenticated])

    if (error) {
        return <Error />
    }
    
    function handleShowPassword(number) {
        if (number === 0) {
            if (showCurrentPassword === true) {
                setShowCurrentPassword(false)
            } else {
                setShowCurrentPassword(true)
            }
        } else if (number === 1) {
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
            <Col md={6} className='mx-auto'>
                <h1 className='text-center mb-3'>Change Password</h1>
                <Form onSubmit={(event) => {
                    event.preventDefault()
                    setShowCurrentPassword(false)
                    setShowPassword1(false)
                    setShowPassword2(false)
                    handlePasswordChange()
                }}>
                <InputGroup className='mb-2'>
                    <FloatingLabel
                        label='Current password'
                        controlId='floatingCurrentPassword'
                    >
                        <Form.Control 
                            type={showCurrentPassword ? 
                                "text" : "password"}
                            value={formState.oldPassword}
                            isInvalid={data && 
                                data.passwordChange.errors.oldPassword}
                            isValid={data && 
                                !data.passwordChange.errors.oldPassword}
                            onChange={(e) => 
                                setFormState({
                                    ...formState,
                                    oldPassword: e.target.value
                                })
                            }
                            placeholder='Current password'
                            required
                        />    
                        <Form.Control.Feedback>
                            Looks good!
                        </Form.Control.Feedback>
                        {data && 
                        data.passwordChange.errors.oldPassword &&
                        data.passwordChange.errors.oldPassword.map(
                            (el) => (
                                <Form.Control.Feedback 
                                    key={el.message} type='invalid'>
                                        {el.message}
                                </Form.Control.Feedback>
                            )
                        )}
                    </FloatingLabel>
                    <InputGroup.Text 
                        onClick={() => handleShowPassword(0)} 
                        className='juju px-3' 
                        id="basic-addon0"
                    >
                        {showCurrentPassword ? <BsEye /> : 
                        <BsEyeSlash />}
                    </InputGroup.Text>
                </InputGroup>
                <InputGroup className='mb-2'>
                    <FloatingLabel
                        label='New password'
                        controlId='floatingPassword1'
                    >
                        <Form.Control 
                            type={showPassword1 ? "text" : "password"}
                            value={formState.newPassword1}
                            isInvalid={data && 
                                data.passwordChange.errors.newPassword1}
                            isValid={data && 
                                !data.passwordChange.errors.newPassword1}
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
                        data.passwordChange.errors.newPassword1 &&
                        data.passwordChange.errors.newPassword1.map(
                            (el) => (
                                <Form.Control.Feedback
                                    key={el.message} type='invalid'>
                                        {el.message}
                                </Form.Control.Feedback>
                            )
                        )}
                    </FloatingLabel>
                    <InputGroup.Text 
                        onClick={() => handleShowPassword(1)} 
                        className='juju px-3' 
                        id="basic-addon1"
                    >
                        {showPassword1 ? <BsEye /> : 
                        <BsEyeSlash />}
                    </InputGroup.Text>
                </InputGroup>
                <InputGroup className='mb-2'>
                    <FloatingLabel
                        label='New password (again)'
                        controlId='floatingPassword2'
                    >
                        <Form.Control 
                            type={showPassword2 ? "text" : "password"}
                            value={formState.newPassword2}
                            isInvalid={data && 
                                data.passwordChange.errors.newPassword2}
                            isValid={data && 
                                !data.passwordChange.errors.newPassword2}
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
                        data.passwordChange.errors.newPassword2 &&
                        data.passwordChange.errors.newPassword2.map(
                            (el) => (
                                <Form.Control.Feedback
                                    key={el.message} type='invalid'>
                                        {el.message}
                                </Form.Control.Feedback>
                            )
                        )}
                    </FloatingLabel>
                    <InputGroup.Text 
                        onClick={() => handleShowPassword(2)} 
                        className='juju px-3' 
                        id="basic-addon2"
                    >
                        {showPassword2 ? <BsEye /> : 
                        <BsEyeSlash />}
                    </InputGroup.Text>
                </InputGroup>
                <Button 
                    variant='primary' 
                    className='login-signup-button py-2 col-12 mb-2' 
                    type='submit'
                    disabled={!(formState.oldPassword &&
                                formState.newPassword1 &&
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
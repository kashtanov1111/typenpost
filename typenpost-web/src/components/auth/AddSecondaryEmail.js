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
import {SEND_SECONDARY_EMAIL_ACTIVATION} from "../../gqls/mutations"
import { IsAuthContext } from "../../context/LoginContext"
import { Loader } from "../Loader"

export function AddSecondaryEmail(props) {
    const {handleAlert, email} = props
    const isAuthenticated = useContext(IsAuthContext)
    const navigate = useNavigate()
    useTitle('Typenpost - Add secondary email')
    
    const [showPassword, setShowPassword] = useState(false)
    const [formState, setFormState] = useState({
        email: '',
        password: '',
    }) 
    const [handleAddSecondaryEmail, { data, loading, error }] = 
        useMutation(SEND_SECONDARY_EMAIL_ACTIVATION, {
            variables: { 
                email: formState.email,
                password: formState.password },
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

    function handleShowPassword() {
        if (showPassword === true) {
            setShowPassword(false)
        } else {
            setShowPassword(true)
        }
    }

    useEffect(() => {
        if (isAuthenticated === false) {
            navigate('../login', {replace: true, state: '/add_email'})
        }
    },[isAuthenticated, navigate])

    if (error) {
        return <Error />
    }
    console.log('AddSecondaryEmail render')
    if (isAuthenticated === null) {
        return <Loader />
    }
    return ((data === undefined || data.sendSecondaryEmailActivation.errors) ?
        <Row>
            <Col md={6} className='mx-auto'>
                <h1 className='text-center mb-3'>Set Secondary Email</h1>
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
                            isInvalid={data && 
                                data.sendSecondaryEmailActivation.errors.email}
                            isValid={data && 
                                !data.sendSecondaryEmailActivation.errors.email}
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
                        <Form.Control.Feedback>
                            Looks good!
                        </Form.Control.Feedback>
                        {data && 
                        data.sendSecondaryEmailActivation.errors.email &&
                        data.sendSecondaryEmailActivation.errors.email.map(
                            (el) => (
                                <Form.Control.Feedback key={el.message} type='invalid'>
                                        {el.message}
                                </Form.Control.Feedback>
                            )
                        )}
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
                            isInvalid={data && 
                                data.sendSecondaryEmailActivation.errors.password}
                            isValid={data && 
                                !data.sendSecondaryEmailActivation.errors.password}
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
                        {data && 
                        data.sendSecondaryEmailActivation.errors.password &&
                        data.sendSecondaryEmailActivation.errors.password.map(
                            (el) => (
                                <Form.Control.Feedback key={el.message} type='invalid'>
                                        {el.message}
                                </Form.Control.Feedback>
                            )
                        )}
                    </FloatingLabel>
                    <InputGroup.Text 
                        onClick={handleShowPassword} 
                        className='juju px-3' id="basic-addon1">
                        {showPassword ? 
                            <BsEye /> : <BsEyeSlash />}
                    </InputGroup.Text>
                </InputGroup>
                <Button 
                    variant='primary' 
                    className='login-signup-button py-2 col-12 mb-2' 
                    type='submit'
                    disabled={!(formState.email && 
                                formState.password) || loading}>
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
        </Row> :
        <Row>
            <Col md={8} className='mx-auto'>
            <h1 className='text-center'>Verify Your New E-mail Address</h1>
            <p>We have sent an e-mail to you for verification. 
            Follow the link provided to finalize the process. 
            If you do not see the verification e-mail in your main inbox,
            check your spam folder. Please contact us 
            if you do not receive the verification e-mail within
            a few minutes.</p>
            </Col>
        </Row>
    )
}
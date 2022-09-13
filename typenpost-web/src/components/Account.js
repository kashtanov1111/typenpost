import React, {useState} from "react"
import { useTitle } from "./App"
import { gql, useMutation } from "@apollo/client"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Spinner from 'react-bootstrap/Spinner'
import { Error } from "./Error"

const VERIFY_ACCOUNT = gql`
    mutation VerifyAccount($token: String!) {
        verifyAccount(token: $token) {
            success
            errors
        }
    }
`

const CHANGE_PASSWORD = gql`
    mutation ChangePassword($oldPassword: String!, 
                            $newPassword1: String!,
                            $newPassword2: String!) {
        passwordChange(oldPassword: $oldPassword,
                        newPassword1: $newPassword1,
                        newPassword2: $newPassword2) {
            success
            errors
        }
    }
`
const SEND_PASSWORD_RESET_EMAIL = gql`
    mutation SendPasswordResetEmail($email: String!) {
        sendPasswordResetEmail(email: $email) {
            success
            errors
        }
    }
`

const PASSWORD_RESET = gql`
    mutation PasswordReset($token: String!,
                            $newPassword1: String!,
                            $newPassword2: String!) {
        passwordReset(token: $token,
                        newPassword1: $newPassword1,
                        newPassword2: $newPassword2) {
            success
            errors
        }
    }
`

const PASSWORD_CHANGE = gql`
    mutation PasswordChange($oldPassword: String!,
                            $newPassword1: String!,
                            $newPassword2: String!) {
        passwordChange(oldPassword: $oldPassword,
                        newPassword1: $newPassword1,
                        newPassword2: $newPassword2) {
            success
            errors
        }
    }
`



export function VerifyAccount(props) {
    const {handleAlert} = props
    const params = useParams()
    const token = params.confirmationToken
    const navigate = useNavigate()
    useTitle('Typenpost - Verify Account')
    const [verifyAccount, { error }] = useMutation(VERIFY_ACCOUNT, {
        variables: { token: token },
        onCompleted: (data) => {
            if (data.verifyAccount.success) {
                handleAlert('Your account has been verified.', 'success')
                navigate('../login', {replace: true})
            }
        }
    })
    if (error) {
        return <Error />
    }
    return (
        <Row>
            <Col md={6} className='mx-auto text-center'>
                <h1>Confirm E-mail Address</h1>
                <p>Please confirm that this is your email address.</p>
                <Button variant='success' onClick={verifyAccount}>Verify Account</Button>
            </Col>
        </Row>

    )
}

export function PasswordReset(props) {
    const location = useLocation()
    const [email, setEmail] = useState(location.state)
    const [emailSent, setEmailSent] = useState(false)
    const [handleEmail, {data, loading, error}] = useMutation(SEND_PASSWORD_RESET_EMAIL, {
        variables: {email: email},
        onCompleted: (data) => {
            if (data.sendPasswordResetEmail.success) {
                setEmailSent(true)
            }
            
        } 
    })
    if (error) {
        return <Error />
    }
    return (
        <Row>
            <Col md={6} className='mx-auto'>
                {!emailSent ? <div>
                <h1 className='text-center'>Password Reset</h1>
                <p>Forgotten your password? Enter your e-mail address below, and we'll send you an e-mail allowing you to reset it.</p>
                <Form onSubmit={(event) => {
                    event.preventDefault()
                    handleEmail()
                    }}
                    noValidate>
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
                            isInvalid={data && data.sendPasswordResetEmail.errors.email}
                            isValid={data && !data.sendPasswordResetEmail.errors.email}
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
                        <Form.Control.Feedback type='invalid'>
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
                    <p>We have sent you an e-mail. If you have not received it please check your spam folder. Otherwise contact us if you do not receive it in a few minutes.</p>
                </div>}
            </Col>
        </Row>
    )
}

export function PasswordResetWithToken(props) {
    const {handleAlert} = props
    const params = useParams()
    const token = params.confirmationToken
    const navigate = useNavigate()
    const [formState, setFormState] = useState({newPassword1: '', 
                                                newPassword2: ''})
    useTitle('Typenpost')
    const [handlePasswordChange, { data, loading, error }] = useMutation(PASSWORD_RESET, {
        variables: { token: token, newPassword1: formState.newPassword1,
                    newPassword2: formState.newPassword2 },
        onCompleted: (data) => {
            if (data.passwordReset.success) {
                handleAlert('Your password has been reset. Thank you!', 'success')
                navigate('../login', {replace: true})
            }
        }
    })
    if (error) {
        return <Error />
    }
    return (
        <Row>
        <Col md={6} className='mx-auto' > 
            <h1 className='text-center mb-3'>Reset Your Password</h1>
            <Form onSubmit={(event) => {
            event.preventDefault()
            handlePasswordChange()
            }}>
            <Form.Group className='mb-3'>
                <FloatingLabel
                    label='New password'
                    controlId='floatingPassword1'
                >
                    <Form.Control 
                        type="password"
                        value={formState.newPassword1}
                        isInvalid={data && data.passwordReset.errors.newPassword1}
                        isValid={data && !data.passwordReset.errors.newPassword1}
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
                    <Form.Control.Feedback type='invalid'>
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
                        type="password"
                        value={formState.newPassword2}
                        isInvalid={data && data.passwordReset.errors.newPassword2}
                        isValid={data && !data.passwordReset.errors.newPassword2}
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
                    <Form.Control.Feedback type='invalid'>
                            {el.message}
                    </Form.Control.Feedback>
                    ))}
                </FloatingLabel>
            </Form.Group>
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

export function PasswordChange(props) {
    const {handleAlert} = props
    const navigate = useNavigate()
    const [formState, setFormState] = useState({oldPassword: '',
                                                newPassword1: '', 
                                                newPassword2: ''})
    useTitle('Typenpost')
    const [handlePasswordChange, { data, loading, error }] = useMutation(PASSWORD_CHANGE, {
        variables: { oldPassword: formState.oldPassword, 
                    newPassword1: formState.newPassword1,
                    newPassword2: formState.newPassword2 },
        onCompleted: (data) => {
            if (data.passwordChange.success) {
                handleAlert('Your password has been changed. Thank you!', 'success')
                navigate('../login', {replace: true})
            }
        }
    })
    if (error) {
        return <Error />
    }
    return (
        <Row>
            <Col md={6} className='mx-auto'>
                <h1 className='text-center mb-3'>Change Password</h1>
                <Form onSubmit={(event) => {
                    event.preventDefault()
                    handlePasswordChange()
                }}>
                <Form.Group className='mb-2'>
                    <FloatingLabel
                        label='Current password'
                        controlId='floatingCurrentPassword'
                    >
                        <Form.Control 
                            type="password"
                            value={formState.oldPassword}
                            isInvalid={data && data.passwordChange.errors.oldPassword}
                            isValid={data && !data.passwordChange.errors.oldPassword}
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
                        data.passwordChange.errors.oldPassword.map((el) => (
                        <Form.Control.Feedback type='invalid'>
                                {el.message}
                        </Form.Control.Feedback>
                        ))}
                    </FloatingLabel>
                </Form.Group>
                <Form.Group className='mb-2'>
                    <FloatingLabel
                        label='New password'
                        controlId='floatingPassword1'
                    >
                        <Form.Control 
                            type="password"
                            value={formState.newPassword1}
                            isInvalid={data && data.passwordChange.errors.newPassword1}
                            isValid={data && !data.passwordChange.errors.newPassword1}
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
                        data.passwordChange.errors.newPassword1.map((el) => (
                        <Form.Control.Feedback type='invalid'>
                                {el.message}
                        </Form.Control.Feedback>
                        ))}
                    </FloatingLabel>
                </Form.Group>
                <Form.Group className='mb-2'>
                    <FloatingLabel
                        label='New password (again)'
                        controlId='floatingPassword2'
                    >
                        <Form.Control 
                            type="password"
                            value={formState.newPassword2}
                            isInvalid={data && data.passwordChange.errors.newPassword2}
                            isValid={data && !data.passwordChange.errors.newPassword2}
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
                        data.passwordChange.errors.newPassword2.map((el) => (
                        <Form.Control.Feedback type='invalid'>
                                {el.message}
                        </Form.Control.Feedback>
                        ))}
                    </FloatingLabel>
                </Form.Group>
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
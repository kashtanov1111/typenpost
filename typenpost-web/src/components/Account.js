import React, {useState} from "react"
import { useTitle } from "./App"
import { useParams, Link } from "react-router-dom"
import { gql, useMutation } from "@apollo/client"
import { useNavigate } from "react-router-dom"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
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

export function PasswordReset() {
    const [email, setEmail] = useState('')
    const [emailSent, setEmailSent] = useState(false)
    const [handleEmail] = useMutation(SEND_PASSWORD_RESET_EMAIL, {
        variables: {email: email},
        onCompleted: (data) => {
            if (data.sendPasswordResetEmail.success) {
                setEmailSent(true)
            }
            
        } 
    })
    return (
        <Row>
            <Col md={6} className='mx-auto text-center'>
                {!emailSent ? <div>
                <h1>Password Reset</h1>
                <p>Forgotten your password? Enter your e-mail address below, and we'll send you an e-mail allowing you to reset it.</p>
                <Form onSubmit={(event) => {
                    event.preventDefault()
                    handleEmail()
                    }}>
                    {/* <Form.Group */}
                    <input 
                        type="email"
                        value={email}
                        onChange={(e) => 
                            setEmail(e.target.value)
                        }
                        placeholder='Your email'
                    />
                    <button type='submit'>Send</button>
                </Form>
                </div> :
                <div>
                    <h1>Password Reset</h1>
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
        onCompleted: () => {
            handleAlert('Your password has been reset. Thank you!', 'success')
            navigate('../login', {replace: true})
        }
    })
    if (loading) {
        return <p>Loading...</p>
    }
    if (error) {
        return <p>Error! {error.message}</p>
    }
    return (
        <div>
            <h1>Reset Your Password</h1>
            <form onSubmit={(event) => {
            event.preventDefault()
            handlePasswordChange()
            }} action=''>
            <input 
                type="password"
                value={formState.newPassword1}
                onChange={(e) => 
                    setFormState({
                        ...formState,
                        newPassword1: e.target.value
                    })
                }
                placeholder='Your New Password'
            />
            <input 
                type="password"
                value={formState.newPassword2}
                onChange={(e) => 
                    setFormState({
                        ...formState,
                        newPassword2: e.target.value
                    })
                }
                placeholder='Your New Password Again'
            />
            <button type='submit'>Submit</button>
        </form>
        </div>
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
        onCompleted: () => {
            handleAlert('Your password has been changed. Thank you!', 'success')
            navigate('../login', {replace: true})
        }
    })
    if (loading) {
        return <p>Loading...</p>
    }
    if (error) {
        return <p>Error! {error.message}</p>
    }
    return (
        <div>
            <h1>Change Password</h1>
            <form onSubmit={(event) => {
            event.preventDefault()
            handlePasswordChange()
            }} action=''>
            <input 
                type="password"
                value={formState.oldPassword}
                onChange={(e) => 
                    setFormState({
                        ...formState,
                        oldPassword: e.target.value
                    })
                }
                placeholder='Your Old Password'
            />
            <input 
                type="password"
                value={formState.newPassword1}
                onChange={(e) => 
                    setFormState({
                        ...formState,
                        newPassword1: e.target.value
                    })
                }
                placeholder='Your New Password'
            />
            <input 
                type="password"
                value={formState.newPassword2}
                onChange={(e) => 
                    setFormState({
                        ...formState,
                        newPassword2: e.target.value
                    })
                }
                placeholder='Your New Password Again'
            />
            <button type='submit'>Submit</button>
        </form>
        </div>
    )
}
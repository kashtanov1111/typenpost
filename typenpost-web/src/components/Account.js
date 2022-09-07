import React, {useState} from "react"
import { useTitle } from "./App"
import { useParams, Link } from "react-router-dom"
import { gql, useMutation } from "@apollo/client"
import { useNavigate } from "react-router-dom"


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
    const [verified, setVerified] = useState(false)
    const token = params.confirmationToken
    const navigate = useNavigate()
    useTitle('Typenpost')
    const [verifyAccount, { data, loading, error }] = useMutation(VERIFY_ACCOUNT, {
        variables: { token: token },
        onCompleted: () => {
            handleAlert('Your account has been verified. Thank you!', 'success')
            navigate('../login', {replace: true})
        }
    })
    if (loading) {
        return <p>Loading...</p>
    }
    if (error) {
        return <p>Error! {error.message}</p>
    }
    return (!verified ?
        <div>   
            <p>Please verify your account.</p>
            <button onClick={verifyAccount}>Verify Account</button>
        </div> :
        <div>
            <p>Your account has been verified. Thank you!</p>
            <Link type="button" to='/login' className="btn btn-outline-dark me-2">Log In</Link>
        </div>
    )
}

export function PasswordReset() {
    const [email, setEmail] = useState('')
    const [emailSent, setEmailSent] = useState(false)
    const [handleEmail] = useMutation(SEND_PASSWORD_RESET_EMAIL, {
        variables: {email: email},
        onCompleted: () => setEmailSent(true)
    })
    return (!emailSent ?
        <div>
        <h1>Password Reset</h1>
        <p>Forgotten your password? Enter your e-mail address below, and we'll send you an e-mail allowing you to reset it.</p>
        <form onSubmit={(event) => {
            event.preventDefault()
            handleEmail()
            }} action=''>
            <input 
                type="email"
                value={email}
                onChange={(e) => 
                    setEmail(e.target.value)
                }
                placeholder='Your email'
            />
            <button type='submit'>Send</button>
        </form>
        </div> :
        <div>
            <h1>Password Reset</h1>
            <p>We have sent you an e-mail. If you have not received it please check your spam folder. Otherwise contact us if you do not receive it in a few minutes.</p>
        </div>
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
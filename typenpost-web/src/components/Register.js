import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const REGISTER_MUTATION = gql`
    mutation register(
        $username: String!
        $email: String!
        $password1: String!
        $password2: String!
    ) {
        register(
            username: $username
            email: $email
            password1: $password1
            password2: $password2
        ) {
            success
            errors
        }
    }
`

const RESEND_ACTIVATION_EMAIL = gql`
    mutation ResendActivationEmail($email: String!) {
        resendActivationEmail(email: $email) {
            success
            errors
        }
    }
`

export function Register() {
    const [validated, setValidated] = useState(false)
    const navigate = useNavigate()
    const [registered, setRegistered] = useState(false)
    const [formState, setFormState] = useState({
        username: '',
        email: '',
        password1: '',
        password2: '',
    })
    const [handleRegister, {data, error, loading}] = useMutation(REGISTER_MUTATION, {
        variables: {
            email: formState.email,
            username: formState.username,
            password1: formState.password1,
            password2: formState.password2,
        },
        onCompleted: (data) => {
            if (data.register.success) {
                setRegistered(true)
            }
        }
    })
    const [handleResend] = useMutation(RESEND_ACTIVATION_EMAIL, {
        variables: {
            email: formState.email
        }
    })
    function handleSubmitForm(event) {
        event.preventDefault()
        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.stopPropagation()
        }
        setValidated(true)
        handleRegister()
    }
    console.log(registered)
    return (!registered ?
        <div className='row'>
        <div className='col-md-6 mx-auto'>
            <h1 className='text-center mb-3'>
                Sign up
            </h1>
            {/* {data && !data.tokenAuth.success &&
            data.tokenAuth.errors.map((el) => (
                <div className="alert alert-danger" role="alert">
                    {el.message}
                </div>
            ))
            } */}
            <form 
                validated={validated}
                className='needs-validation '
                onSubmit={handleSubmitForm} 
                noValidate>
                <div className='form-floating mb-3 has-validation'>
                    <input 
                        className='form-control'
                        id='floatingInputEmail'
                        type="email"
                        value={formState.email}
                        onChange={(e) => 
                            setFormState({
                                ...formState,
                                email: e.target.value
                            })
                        }
                        placeholder='Email address'
                        required
                    />    
                    <label for="floatingInputEmail">Email address</label>
                    <div className='invalid-feedback'>
                        Please provide a valid email.
                    </div>
                </div>
                <div className='form-floating mb-3'>
                    <input 
                        className='form-control'
                        id='floatingInputUsername'
                        type="text"
                        value={formState.username}
                        onChange={(e) => 
                            setFormState({
                                ...formState,
                                username: e.target.value
                            })
                        }
                        placeholder='Username'
                        required
                    />
                    <label for="floatingInputUsername">Username</label>
                    <div className='valid-feedback'>
                        Please provide a valid email.
                    </div>
                </div>
                <div className='form-floating mb-3'>
                    <input
                        className='form-control'
                        id='floatingInputPassword1'
                        type="password"
                        value={formState.password1}
                        onChange={(e) => 
                            setFormState({
                                ...formState,
                                password1: e.target.value
                            })
                        }
                        placeholder='Password'
                        required
                    />
                    <label for="floatingInputPassword1">Password</label>
                </div>
                <div className='form-floating mb-3'>
                    <input 
                        className='form-control'
                        id='floatingInputPassword2'
                        type="password"
                        value={formState.password2}
                        onChange={(e) => 
                            setFormState({
                                ...formState,
                                password2: e.target.value
                            })
                        }
                        placeholder='Password (again)'
                        required
                    />
                    <label for="floatingInputPassword2">Password (again)</label>
                </div>
                <button className='login-signup-button btn btn-primary py-2 col-12 mb-2' type='submit'>
                    Sign Up
                </button>
                <div className='text-center'>
                    <Link type="link" to='/login' >Already have an account?</Link>
                </div>
            </form>
        </div>
        </div> :
        <div>
            <h1>Please confirm your email.</h1>
            <p>Is Confirmation email not coming?</p>
            <button onClick={handleResend}>Resend</button>
        </div>
    )
}
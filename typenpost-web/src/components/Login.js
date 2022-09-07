import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";



const LOGIN_MUTATION = gql`
    mutation tokenAuth(
        $username: String
        $password: String!
    ) {
        tokenAuth(
            username: $username
            password: $password
        ) {
            success
            errors
        }
    }
`

export function Login(props) {
    const navigate = useNavigate()
    const {handleAlert} = props
    const [formState, setFormState] = useState({
        username: '',
        password: '',
    })

    const [handleLogin, { data, loading, error}] = useMutation(LOGIN_MUTATION, {
        variables: {
            username: formState.username,
            password: formState.password
        },
        onCompleted: (data) => {  
            if (data.tokenAuth.success) {
                handleAlert('You have logged in.', 'success')
                navigate('../', {replace: true})
            } 
        }
    })
    
    if (loading) return <></>;
    return (
        <div className='row'>
            <div className='col-md-6 mx-auto'>
            <h1 className='text-center mb-3'>
                Log In
            </h1>
            {data && !data.tokenAuth.success &&
            data.tokenAuth.errors.nonFieldErrors.map((el) => (
                <div className="alert alert-danger" role="alert">
                    {el.message}
                </div>
            ))
            }
            <form onSubmit={(event) => {
                event.preventDefault()
                handleLogin()
            }}>
                <div className='form-floating mb-3'>
                    <input 
                        className='form-control'
                        id='floatingInputEmail'
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
                </div>
                <div className='form-floating mb-3'>
                    <input 
                        className='form-control'
                        id='floatingInputPassword'
                        type="password"
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
                    <label for="floatingInputPassword">Password</label>
                </div>
                <button type='submit' className='login-signup-button btn btn-primary py-2 col-12 mb-2'>
                    <b>Log In</b>
                </button>
                <div className='text-center'>
                    <Link type="link" to='/password_reset' >Forgot Account?</Link>
                    <span> ∙ </span>
                    <Link type="link" to='/register' >Sign up</Link>
                </div>
            </form>
            </div>
        </div>
    )
}
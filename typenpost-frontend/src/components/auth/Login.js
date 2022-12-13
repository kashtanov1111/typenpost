import React, { useEffect, useState, useContext } from "react";
import { useMutation } from "@apollo/client";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { SpinnerForButton } from "../SpinnerForButton";
import { Loader } from "../Loader";
import { Error } from "../Error";

import { useTitle } from '../../customHooks/hooks'

import { LOGIN_MUTATION } from "../../gqls/mutations";
import { IsAuthContext } from "../../context/LoginContext";

export function Login({handleAlert, queryMe, setIsAuthenticated }) {
    const navigate = useNavigate()
    const isAuthenticated = useContext(IsAuthContext)
    const location = useLocation()
    useTitle('Typenpost - Log In')

    const [showPassword, setShowPassword] = useState(false)
    const [formState, setFormState] = useState({
        usernameOrEmail: '',
        password: '',
    })
    const [handleLogin, { data, loading, error }] = useMutation(
        LOGIN_MUTATION
        , {
            onCompleted: (data) => {
                if (data.tokenAuth.success) {
                    // console.log('LOGIN MUTATION completed and succeed')
                    handleAlert(
                        'Successfully signed in as ' +
                        formState.usernameOrEmail.toLowerCase(), 'success')
                    if (location.state) {
                        if (
                            location.state.startsWith('/login') ||
                            location.state.startsWith('/register') ||
                            location.state.startsWith('/password_reset') ||
                            location.state.startsWith('/activate')
                        ) {
                            navigate('../', { replace: true })
                        } else {
                            navigate(
                                '..' + location.state, { replace: true })
                        }
                    } else {
                        navigate('../', { replace: true })
                    }
                    queryMe()
                    setIsAuthenticated(true)
                }
            }
        }
    )

    useEffect(() => {
        if (isAuthenticated) {
            navigate('../', { replace: true })
        }
    }, [isAuthenticated, navigate])
    
    function handleUsernameOrEmailInput() {
        if (formState.usernameOrEmail.includes('@')) {
            return 'Email'
        } else if (formState.usernameOrEmail === '') {
            return 'Username or Email'
        } else {
            return 'Username'
        }
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
        var variables = { password: formState.password }
        if (handleUsernameOrEmailInput() === 'Email') {
            variables.email = formState.usernameOrEmail.toLowerCase()
        } else {
            variables.username = formState.usernameOrEmail.toLowerCase()
        }
        handleLogin({ variables: variables })
    }

    // if (error) {
    //     return <Error />
    // }

    // if (isAuthenticated === null) {
    //     return <Loader />
    // }
    
    console.log('Render Login Component')

    return (
        <>
            <h1>log in page</h1>
        </>
//         <>
//             <Row>
//                 <Col md={6} className='mx-auto'>
//                     <h1 className='text-center mt-2 mb-3'>
//                         Log In
//                     </h1>
//                     {data && !data.tokenAuth.success &&
//                         data.tokenAuth.errors.nonFieldErrors.map((el) => (
//                             <Alert key='danger' variant='danger'>
//                                 {el.message}
//                             </Alert>
//                         ))
//                     }
//                     <Form
//                         onSubmit={handleSubmit}
//                         noValidate
//                     >
//                         <Form.Group className='mb-3'>
//                             <FloatingLabel
//                                 label={handleUsernameOrEmailInput()}
//                                 controlId='floatingInput'
//                             >
//                                 <Form.Control
//                                     type="text"
//                                     value={formState.usernameOrEmail}
//                                     onChange={(e) =>
//                                         setFormState({
//                                             ...formState,
//                                             usernameOrEmail: e.target.value,

//                                         })
//                                     }
//                                     disabled={loading}
//                                     placeholder={handleUsernameOrEmailInput()}
//                                     required
//                                 />
//                             </FloatingLabel>
//                         </Form.Group>
//                         <InputGroup className='mb-3'>
//                             <FloatingLabel
//                                 label='Password'
//                                 controlId='floatingPassword'
//                             >
//                                 <Form.Control
//                                     type={showPassword ? "text" : "password"}
//                                     value={formState.password}
//                                     onChange={(e) =>
//                                         setFormState({
//                                             ...formState,
//                                             password: e.target.value
//                                         })
//                                     }
//                                     disabled={loading}
//                                     placeholder='Password'
//                                     required
//                                 />
//                             </FloatingLabel>
//                             <InputGroup.Text
//                                 onClick={handleShowPassword}
//                                 className='juju px-3' id="basic-addon1">
//                                 {showPassword ?
//                                     <BsEye /> : <BsEyeSlash />}
//                             </InputGroup.Text>
//                         </InputGroup>
//                         <Button
//                             type='submit'
//                             variant='primary'
//                             className='login-signup-button py-2 col-12 mb-2'
//                             disabled={!(formState.usernameOrEmail &&
//                                 formState.password) || loading}>
//                             {loading ?
//                                 <SpinnerForButton /> :
//                                 <b>Log In</b>
//                             }
//                         </Button>
//                         <div className='text-center'>
//                             <Link
//                                 type="link"
//                                 to='/password_reset'
//                                 state={(handleUsernameOrEmailInput() === 'Email') ?
//                                     formState.usernameOrEmail :
//                                     ''}>
//                                 Forgot Account?
//                             </Link>
//                             <span> ∙ </span>
//                             <Link
//                                 type="link"
//                                 to='/register'>
//                                 Sign up
//                             </Link>
//                         </div>
//                     </Form>
//                 </Col>
//             </Row>
//         </>
    )
}
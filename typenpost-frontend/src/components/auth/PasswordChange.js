// import React, { useState, useEffect, useContext } from "react"
// import { useMutation } from "@apollo/client"
// import { useNavigate } from "react-router-dom"
// import { Loader } from "../Loader"
// import { useTitle } from '../../customHooks/hooks'
// import { SpinnerForButton } from "../SpinnerForButton"
// import { Error } from "../Error"

// import Row from 'react-bootstrap/Row'
// import Col from 'react-bootstrap/Col'
// import Button from 'react-bootstrap/Button'
// import Form from 'react-bootstrap/Form'
// import FloatingLabel from 'react-bootstrap/FloatingLabel'
// import InputGroup from 'react-bootstrap/InputGroup'
// import { BsEye } from 'react-icons/bs'
// import { BsEyeSlash } from 'react-icons/bs'

// import { PASSWORD_CHANGE } from "../../gqls/mutations"
// import { IsAuthContext } from "../../context/LoginContext"

// export function PasswordChange(props) {
//     const { handleAlert, handleLogout } = props
//     const isAuthenticated = useContext(IsAuthContext)

//     const navigate = useNavigate()
//     useTitle('Typenpost - Password Change')

//     const [showCurrentPassword, setShowCurrentPassword] = useState(false)
//     const [showPassword1, setShowPassword1] = useState(false)
//     const [showPassword2, setShowPassword2] = useState(false)
//     const [formState, setFormState] = useState({
//         oldPassword: '',
//         newPassword1: '',
//         newPassword2: ''
//     })

//     const [handlePasswordChange, { data, loading, error }] = useMutation(
//         PASSWORD_CHANGE, {
//         variables: {
//             oldPassword: formState.oldPassword,
//             newPassword1: formState.newPassword1,
//             newPassword2: formState.newPassword2
//         },
//         onCompleted: async (data) => {
//             console.log(data)
//             if (data.passwordChange.success) {
//                 handleAlert(
//                     'Your password has been successfully changed. Please log in.',
//                     'success')
//                 await handleLogout()
//                 navigate('../login', { replace: true })
//             }
//         }
//     }
//     )

//     const oldPasswordError = data && data.passwordChange.errors.oldPassword
//     const newPasswordErrors = data && data.passwordChange.errors.newPassword2
//     const isPasswordMismatchError =
//         newPasswordErrors && newPasswordErrors[0].code === 'password_mismatch'

//     useEffect(() => {
//         if (isAuthenticated === false) {
//             navigate('../login', { replace: true, state: '/password_change' })
//         }
//     }, [isAuthenticated, navigate])

//     if (error) {
//         return <Error />
//     }

//     if (isAuthenticated === null) {
//         return <Loader />
//     }

//     return (isAuthenticated === true &&
//         <Row>
//             <Col md={6} className='mx-auto'>
//                 <h1 className='text-center mt-2 mb-3'>Change Password</h1>
//                 <Form onSubmit={(event) => {
//                     event.preventDefault()
//                     setShowCurrentPassword(false)
//                     setShowPassword1(false)
//                     setShowPassword2(false)
//                     handlePasswordChange()
//                 }}>
//                     <InputGroup className='mb-2'>
//                         <FloatingLabel
//                             label='Current password'
//                             controlId='floatingCurrentPassword'
//                         >
//                             <Form.Control
//                                 type={showCurrentPassword ?
//                                     "text" : "password"}
//                                 value={formState.oldPassword}
//                                 isInvalid={oldPasswordError}
//                                 isValid={data && !oldPasswordError}
//                                 onChange={(e) =>
//                                     setFormState({
//                                         ...formState,
//                                         oldPassword: e.target.value
//                                     })
//                                 }
//                                 disabled={loading}
//                                 placeholder='Current password'
//                                 required
//                             />
//                             <Form.Control.Feedback>
//                                 Looks good!
//                             </Form.Control.Feedback>
//                             {oldPasswordError &&
//                                 <Form.Control.Feedback type='invalid'>
//                                     {oldPasswordError[0].message}
//                                 </Form.Control.Feedback>
//                             }
//                         </FloatingLabel>
//                         <InputGroup.Text
//                             onClick={() => setShowCurrentPassword(!showCurrentPassword)}
//                             className='juju px-3'
//                             id="basic-addon0"
//                         >
//                             {showCurrentPassword ? <BsEye /> :
//                                 <BsEyeSlash />}
//                         </InputGroup.Text>
//                     </InputGroup>
//                     <InputGroup className='mb-2'>
//                         <FloatingLabel
//                             label='New password'
//                             controlId='floatingPassword1'
//                         >
//                             <Form.Control
//                                 type={showPassword1 ? "text" : "password"}
//                                 value={formState.newPassword1}
//                                 isInvalid={
//                                     newPasswordErrors &&
//                                     !isPasswordMismatchError
//                                 }
//                                 disabled={loading}
//                                 onChange={(e) =>
//                                     setFormState({
//                                         ...formState,
//                                         newPassword1: e.target.value
//                                     })
//                                 }
//                                 placeholder='New password'
//                                 required
//                             />
//                             {newPasswordErrors && newPasswordErrors.map(
//                                 (el) => (
//                                     <Form.Control.Feedback
//                                         key={el.message} type='invalid'>
//                                         {el.message}
//                                     </Form.Control.Feedback>
//                                 )
//                             )}
//                         </FloatingLabel>
//                         <InputGroup.Text
//                             onClick={() => setShowPassword1(!showPassword1)}
//                             className='juju px-3'
//                             id="basic-addon1"
//                         >
//                             {showPassword1 ? <BsEye /> :
//                                 <BsEyeSlash />}
//                         </InputGroup.Text>
//                     </InputGroup>
//                     <InputGroup className='mb-2'>
//                         <FloatingLabel
//                             label='New password (again)'
//                             controlId='floatingPassword2'
//                         >
//                             <Form.Control
//                                 type={showPassword2 ? "text" : "password"}
//                                 value={formState.newPassword2}
//                                 isInvalid={
//                                     data &&
//                                     !oldPasswordError}
//                                 onChange={(e) =>
//                                     setFormState({
//                                         ...formState,
//                                         newPassword2: e.target.value
//                                     })
//                                 }
//                                 disabled={loading}
//                                 placeholder='New password (again)'
//                                 required
//                             />
//                             {isPasswordMismatchError &&
//                                 <Form.Control.Feedback type='invalid'>
//                                     {newPasswordErrors[0].message}
//                                 </Form.Control.Feedback>
//                             }
//                         </FloatingLabel>
//                         <InputGroup.Text
//                             onClick={() => setShowPassword2(!showPassword2)}
//                             className='juju px-3'
//                             id="basic-addon2"
//                         >
//                             {showPassword2 ? <BsEye /> :
//                                 <BsEyeSlash />}
//                         </InputGroup.Text>
//                     </InputGroup>
//                     <Button
//                         variant='primary'
//                         className='login-signup-button py-2 col-12 mb-2'
//                         type='submit'
//                         disabled={!(formState.oldPassword &&
//                             formState.newPassword1 &&
//                             formState.newPassword2) ||
//                             loading}
//                     >
//                         {loading ?
//                             <SpinnerForButton /> :
//                             <b>Save</b>
//                         }
//                     </Button>
//                 </Form>
//             </Col>
//         </Row>
//     )
// }
import React, {useState, useEffect, useContext} from "react"
import { useMutation } from "@apollo/client"
import { useNavigate, useLocation} from "react-router-dom"

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

import { REMOVE_SECONDARY_EMAIL } from "../../gqls/mutations"
import { IsAuthContext } from "../../context/LoginContext"

export function RemoveSecondaryEmail(props) {
    const isAuthenticated = useContext(IsAuthContext)
    const {handleAlert, secondaryEmail} = props
    const navigate = useNavigate()
    const location = useLocation()
    useTitle('Typenpost - Remove Secondary Email')

    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    
    const [handleRemoveSecondaryEmail, {data, error, loading}] = 
        useMutation(REMOVE_SECONDARY_EMAIL, {
          variables: {password: password},
          onCompleted: (data) => {
            if (data.removeSecondaryEmail.success) {
              handleAlert('Secondary email was successfully removed.',
                 'success')
              navigate('..' + location.state, {replace: true})
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
        if (!isAuthenticated) {
            navigate('../login', 
                {replace: true, state: '/remove_secondary_email'})
        }
        if (!secondaryEmail) {
            navigate(-1)
        }
    }, [isAuthenticated, secondaryEmail])

    if (error) {
        return <Error />
    }

    return (
        <Row>
            <Col md={6} className='mx-auto'>
                <h1 className='text-center mb-3'>
                    Remove Secondary Email
                </h1>
                <Form onSubmit={(event) => {
                    event.preventDefault()
                    setShowPassword(false)
                    handleRemoveSecondaryEmail()
                }}>
                <InputGroup className='mb-3'>
                    <FloatingLabel
                        label='Password'    
                        controlId='floatingPassword'
                    >
                        <Form.Control 
                            type={showPassword ? "text" : "password"}
                            value={password}
                            isInvalid={data && 
                                data.removeSecondaryEmail.errors.password}
                            isValid={data && 
                                !data.removeSecondaryEmail.errors.password}
                            onChange={(e) => 
                                setPassword(e.target.value)
                            }
                            placeholder='Password'
                            required
                        />
                        <Form.Control.Feedback>
                            Looks good!
                        </Form.Control.Feedback>
                        {data && 
                        data.removeSecondaryEmail.errors.password &&
                        data.removeSecondaryEmail.errors.password.map(
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
                    disabled={!password}>
                    {loading ? 
                    <div><Spinner
                        as='span'
                        animation='border'
                        size='sm'
                        role='status'
                        aria-hidden='true' />
                    <span className='visually-hidden'>Loading...</span>
                    </div> :
                    <b>Remove</b>
                    }
                </Button>
                </Form>
            </Col>
        </Row>
    )
}

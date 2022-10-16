import React, {useState, useEffect} from "react"
import { useMutation } from "@apollo/client"
import { useNavigate} from "react-router-dom"

import { useTitle } from '../../functions/functions'

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

import { ARCHIVE_ACCOUNT } from "../../gqls/mutations"

export function ArchiveAccount(props) {
    const {handleAlert, isAuthenticated, handleLogout} = props
    const navigate = useNavigate()
    useTitle('Typenpost - Archive Account')

    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    
    const [handleArchiveAccount, {data, error, loading}] = useMutation(
        ARCHIVE_ACCOUNT, {
          variables: {password: password},
          onCompleted: async (data) => {
            console.log(data)
            if (data.archiveAccount.success) {
                await handleLogout()
                handleAlert('You have successfully archived your account.',
                    'success')
                navigate('../login', {replace: true})
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
                {replace: true, state: '/archive_account'})
        }
    }, [isAuthenticated])

    if (error) {
        return <Error />
    }

    return (
        <Row>
            <Col md={6} className='mx-auto'>
                <h1 className='text-center mb-3'>Archive Account</h1>
                <p>You are about to archive your Typenpost account. 
                    All information related to your account will 
                    no longer be viewable on Typenpost. Your username
                    will be saved and no one will be able to take it. 
                    You can easily restore your account with all related
                     information by logging in again in the future.</p>
                <Form onSubmit={(event) => {
                    event.preventDefault()
                    setShowPassword(false)
                    handleArchiveAccount()
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
                                data.archiveAccount.errors &&
                                data.archiveAccount.errors.password}
                            isValid={data && 
                                data.archiveAccount.errors &&
                                !data.archiveAccount.errors.password}
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
                        data.archiveAccount.errors &&
                        data.archiveAccount.errors.password &&
                        data.archiveAccount.errors.password.map(
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
                    variant='danger' 
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
                    <b>Archive</b>
                    }
                </Button>
                </Form>
            </Col>
        </Row>
    )
}

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

import { USERNAME_CHANGE } from "../../gqls/mutations"

export function UsernameChange(props) {
    const {handleAlert, isAuthenticated, handleLogout} = props
    const navigate = useNavigate()
    useTitle('Typenpost - Username Change')
    
    const [newUsername, setNewUsername] = useState('')
                                                
    const [handleUsernameChange, { data, loading, error }] = useMutation(
        USERNAME_CHANGE, {
        variables: { username: newUsername },
        onCompleted: async (data) => {
                if (data.usernameChange.success) {
                    handleAlert(
                        'Your username has been changed. Please log in.', 
                        'success')
                    await handleLogout()
                    navigate('../login', {replace: true})
                }
            }
        }
    )

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('../login', {replace: true, state: '/username_change'})
        }
    }, [isAuthenticated])

    function handleUsernameType(e) {
        const reg = /^[a-z0-9._]*$/
        if (reg.test(e.target.value)) {
            setNewUsername(e.target.value)
        }
    }

    if (error) {
        return <Error />
    }
    
    return (
        <Row>
            <Col md={6} className='mx-auto'>
                <h1 className='text-center mb-3'>Change Username</h1>
                <Form onSubmit={(event) => {
                    event.preventDefault()
                    handleUsernameChange()
                }}>
                <Form.Group className='mb-2'>
                    <FloatingLabel
                        label='Username'
                        controlId='floatingUsername'
                    >
                        <Form.Control 
                            type="text"
                            maxLength={20}
                            isInvalid={data && 
                                data.usernameChange.errors.username}
                            isValid={data && 
                                !data.usernameChange.errors.username}
                            value={newUsername}
                            onChange={(e) =>
                                handleUsernameType(e)
                            }
                            placeholder='Username'
                            required
                        />    
                        <Form.Control.Feedback>
                            Looks good!
                        </Form.Control.Feedback>
                        {data && 
                        data.usernameChange.errors.username &&
                        data.usernameChange.errors.username.map(
                            (el) => (
                                <Form.Control.Feedback
                                    key={el.message} type='invalid'>
                                        {el}
                                </Form.Control.Feedback>
                            )
                        )}
                    </FloatingLabel>
                </Form.Group>
                <Button 
                    variant='primary' 
                    className='login-signup-button py-2 col-12 mb-2' 
                    type='submit'
                    disabled={!newUsername}
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
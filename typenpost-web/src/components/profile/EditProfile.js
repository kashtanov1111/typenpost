import nobody from '../../assets/images/nobody.jpg'

import React, {useState, useEffect, useRef} from "react";
import { useTitle } from "../../functions/functions";
import { Link, useNavigate } from "react-router-dom";
import { QUERY_ME } from "../../gqls/queries";
import { EDIT_PROFILE } from '../../gqls/mutations';
import { Error } from "../Error";
import ProgressiveImage from 'react-progressive-graceful-image'
import { useMutation, useLazyQuery } from "@apollo/client";
import { Loader } from "../Loader";
import { useLocation } from 'react-router-dom';

import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'

export function EditProfile(props) {
    const {isAuthenticated, handleAlert} = props
    const location = useLocation()
    const navigate = useNavigate()
    const textareaRef = React.createRef()
    const hasTextareaInitiallyChanged = useRef(false)
    useTitle('Typenpost - Edit Profile')

    const [userData, setUserData] = useState('')
    const [userProfileData, setUserProfileData] = useState('')

    const [getUserProfile, {
        loading: loadingQueryMe, 
        error: errorQueryMe}] = useLazyQuery(
        QUERY_ME, {
            onCompleted: (data) => {
                setUserData(data.me)
                setUserProfileData(data.me.profile)
            }
        }     
    )

    const [handleEditProfile, {
        loading: loadingEditProfile,
        error: errorEditProfile}] = useMutation(
        EDIT_PROFILE, {
            variables: {
                about: userProfileData.about,
                firstName: userData.firstName,
                lastName: userData.lastName
            },
            onCompleted: (data) => {
                hasTextareaInitiallyChanged.current = false
                handleAlert(
                    'Your profile has been successfully changed',
                     'success')
                navigate('../profile/' + userData.id, {replace: true})
            }
        }
    )

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('../login', {replace: true, state: '/profile/edit'})
        }
    },[isAuthenticated])
    
    useEffect(() => {
        if (location.state !== null) {
            setUserData(location.state.user)
            setUserProfileData(location.state.user.profile)
        } else {
            getUserProfile()
        }
    }, [])

    useEffect(() => {
        if (
            textareaRef.current && 
            hasTextareaInitiallyChanged.current === false) {
                textareaRef.current.style.height = 
                (`${textareaRef.current.scrollHeight}px`)
                hasTextareaInitiallyChanged.current = true
        }
    }, [textareaRef])

    function handleKeyDown(e) {
        e.target.style.height = 'inherit'
        e.target.style.height= `${e.target.scrollHeight}px`
    }

    function handleSubmit(event) {
        event.preventDefault()
        handleEditProfile()
    }

    if (loadingQueryMe) {
        return <Loader />
    }

    if (errorQueryMe ||
        errorEditProfile) {
            return <Error />
    }

    return (userData && userProfileData ?
        <Row>
        <Col md={6} className='mx-auto' >
            <h1 className='text-center mb-3'>
                Edit Profile
            </h1>
            <Form 
                onSubmit={handleSubmit} 
                noValidate>
                <Form.Group className='mb-2'>
                    <FloatingLabel
                        label='First name'
                        controlId='floatingFirstName'
                    >
                        <Form.Control 
                            type="text"
                            maxLength={150}
                            value={userData.firstName}
                            onChange={(e) => 
                                setUserData({
                                    ...userData,
                                    firstName: e.target.value
                                })
                            }
                            placeholder='First name'
                            required
                        />    
                    </FloatingLabel>
                </Form.Group>
                <Form.Group className='mb-2'>
                    <FloatingLabel
                        label='Last name'
                        controlId='floatingLastName'
                    >
                        <Form.Control 
                            type="text"
                            maxLength={150}
                            value={userData.lastName}
                            onChange={(e) => 
                                setUserData({
                                    ...userData,
                                    lastName: e.target.value
                                })
                            }
                            placeholder='Last name'
                            required
                        />    
                    </FloatingLabel>
                </Form.Group>
                <Form.Group className='mb-2'>
                    <FloatingLabel
                        label='About me'
                        controlId='floatingAboutMe'
                    >
                        <Form.Control 
                            as='textarea'
                            maxLength={350}
                            ref={textareaRef}
                            onKeyDown={handleKeyDown}
                            value={userProfileData.about}
                            onChange={(e) => {
                                setUserProfileData({
                                    ...userProfileData,
                                    about: e.target.value
                                })
                            }
                            }
                            placeholder='About me'
                            required
                        />    
                    </FloatingLabel>
                </Form.Group>
                <Button 
                    variant='primary' 
                    className='login-signup-button py-2 col-12 mb-2' 
                    type='submit'
                    >
                    {loadingEditProfile ? 
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
        </Row> :
        <Loader />
    )
}
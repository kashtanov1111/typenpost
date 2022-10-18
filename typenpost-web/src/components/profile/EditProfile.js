import nobody from '../../assets/images/nobody.jpg'

import React, {useState, useEffect, useRef} from "react";
import { useTitle } from "../../functions/functions";
import { Link, useNavigate } from "react-router-dom";
import { QUERY_ME } from "../../gqls/queries";
import { 
    EDIT_PROFILE, 
    DELETE_USER_PROFILE_AVATAR } from '../../gqls/mutations';
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

import { 
    convertBase64,
    createImagePlaceholderUrl } from '../../functions/functions';
import FormLabel from 'react-bootstrap/esm/FormLabel';

export function EditProfile(props) {
    const {isAuthenticated, handleAlert} = props
    const location = useLocation()
    const navigate = useNavigate()
    const textareaRef = React.createRef()
    const hasTextareaInitiallyChanged = useRef(false)
    useTitle('Typenpost - Edit Profile')

    const [userData, setUserData] = useState('')
    const [userProfileData, setUserProfileData] = useState('')
    const [errorImage, setErrorImage] = useState({
        error: false,
        message: ''
    })

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
                lastName: userData.lastName,
                avatar: (
                    userProfileData.avatar && 
                    userProfileData.avatar.startsWith('http') ? 
                    '' : userProfileData.avatar),
            },
            onCompleted: (data) => {
                if (data.editProfile.success) {
                    hasTextareaInitiallyChanged.current = false
                    handleAlert(
                        'Your profile has been successfully changed.',
                         'success')
                    navigate('../profile/' + userData.id, {replace: true})
                }
            }
        }
    )
    const [handleDeleteUserProfileAvatar, {
        error: errorDeleteUserProfileAvatar,
        loading: loadingDeleteUserProfileAvatar
    }] = useMutation(DELETE_USER_PROFILE_AVATAR, {
        onCompleted: (data) => {
            if (data.deleteUserProfileAvatar.success) {
                setUserProfileData({
                    ...userProfileData,
                    avatar: ''
                })
            }
        }
    })

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

    async function handleSubmit(event) {
        event.preventDefault()
        handleEditProfile()
    }

    async function handleImageChange(e) {
        const file = e.target.files[0]
        if (file.size > 10485760) {
            setErrorImage({
                error: true, 
                message: 'File size exceeds 10 Mb. Please choose another image.'})
            setTimeout(() => {
                setErrorImage({error: false, message: ''})}, 3000)
            e.target.value = ''
        } else {
            setErrorImage({error: false, message: 'Good'})
            const base64 = await convertBase64(file)
            setUserProfileData({
                ...userProfileData,
                avatar: base64
            })
        }
    }

    function handleDeleteBtn() {
        handleDeleteUserProfileAvatar()
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
                <div className='text-center container-image'>
                <ProgressiveImage 
                  src={userProfileData && userProfileData.avatar ? 
                    userProfileData.avatar : nobody} 
                  placeholder={userProfileData && 
                    userProfileData.avatar ? 
                    createImagePlaceholderUrl(
                        userProfileData.avatar, '16x16') : nobody}
                >
                  {(src, loading) => 
                    <img 
                      style={{filter: loading && 'blur(8px}', 
                        'WebkitFilter': loading && 'blur(8px)',}} 
                      height='150' 
                      width='150' 
                      className={userProfileData.avatar ? 'darkened-img rounded-circle' : 'rounded-circle'}
                      src={src}
                      alt="mdo" />}
                </ProgressiveImage>
                <div className='centered'>
                    {userProfileData.avatar &&
                    <p 
                        className='pointer mb-0'
                        onClick={handleDeleteBtn}>
                    {loadingDeleteUserProfileAvatar ? 
                    <div><Spinner
                        as='span'
                        animation='border'
                        size='sm'
                        role='status'
                        aria-hidden='true' />
                    <span className='visually-hidden'>Loading...</span>
                    </div> :
                    'Delete'
                    }
                    </p>}
                </div>
                </div>
                <Form.Group controlId="formFile" className="mb-2 mt-0">
                    <FormLabel className='mb-1'>New Image</FormLabel>
                    <Form.Control
                        type="file"
                        accept="image/jpeg,image/png"
                        isInvalid={errorImage.error}
                        isValid={errorImage.message === 'Good'}
                        onChange={(e) => handleImageChange(e)}
                    />
                    <Form.Control.Feedback>
                            Looks good!
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type='invalid'>
                            {errorImage.message}
                    </Form.Control.Feedback>
                    {errorImage.message === '' && <Form.Text muted>
                        File size should not exceed 10 Mb.
                    </Form.Text>}
                </Form.Group>
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
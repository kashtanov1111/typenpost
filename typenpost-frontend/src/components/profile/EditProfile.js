import nobody from '../../assets/images/nobody.jpg'
import React, { useState, useEffect, useContext } from "react";
import { useTitle } from '../../customHooks/useTitle';
import { useNavigate } from "react-router-dom";
import { QUERY_ME_FOR_EDIT_PROFILE } from "../../gqls/queries";
import {
    EDIT_PROFILE,
    DELETE_USER_PROFILE_AVATAR
} from '../../gqls/mutations';
import { Error } from "../Error";
import ProgressiveImage from 'react-progressive-graceful-image'
import { useMutation, useLazyQuery } from "@apollo/client";
import { useLocation } from 'react-router-dom';

import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import { LogoBanner } from '../LogoBanner';

import {
    convertBase64,
    createImagePlaceholderUrl
} from '../../functions/functions';
import FormLabel from 'react-bootstrap/esm/FormLabel';
import {
    IsAuthContext,
    UsernameContext,
    ProfileIdContext
} from '../../context/LoginContext';
import { createImageSrcUrl } from '../../functions/functions';

export function EditProfile({ handleAlert }) {
    console.log('Edit Profile render')

    const isAuthenticated = useContext(IsAuthContext)
    const authenticatedUserProfileId = useContext(ProfileIdContext)
    const username = useContext(UsernameContext)
    const navigate = useNavigate()
    const location = useLocation()
    useTitle('Typenpost - Edit Profile')
    const [userData, setUserData] = useState(location.state)
    const [errorImage, setErrorImage] = useState({
        error: false,
        message: ''
    })
    var nameLimitExceeded = false
    var aboutLimitExceeded = false

    if (userData) {
        if (userData.name && userData.name.length > 55) {
            nameLimitExceeded = true
        }
        if (userData.about && userData.about.length > 350) {
            aboutLimitExceeded = true
        }

    }

    const [getUserProfile, { error: errorQueryMe }] = useLazyQuery(
        QUERY_ME_FOR_EDIT_PROFILE,
        {
            onCompleted: (data) => {
                setUserData({
                    avatar: data.me.profile.avatar,
                    name: data.me.name,
                    about: data.me.profile.about,
                })
            }
        }
    )

    const [handleEditProfile, {
        loading: loadingEditProfile,
        error: errorEditProfile }] = useMutation(
            EDIT_PROFILE, {
            variables: {
                about: userData && userData.about,
                name: userData && userData.name,
                avatar: userData && (
                    (userData.avatar &&
                        userData.avatar.startsWith('http')) ?
                        '' : userData.avatar),
            },
            onCompleted: (data) => {
                if (data.editProfile.success) {
                    handleAlert(
                        'Your profile has been successfully changed.',
                        'success')
                    navigate('../profile/' + username, { replace: true })
                }
            },
        }
        )

    const [handleDeleteUserProfileAvatar, {
        error: errorDeleteUserProfileAvatar,
        loading: loadingDeleteUserProfileAvatar
    }] = useMutation(DELETE_USER_PROFILE_AVATAR, {
        onCompleted: (data) => {
            if (data.deleteUserProfileAvatar.success) {
                setUserData({
                    ...userData,
                    avatar: ''
                })
            }
        },
        update(cache) {
            cache.modify({
                id: 'UserProfileNode:' + authenticatedUserProfileId,
                fields: {
                    avatar() {
                        return null
                    }
                }
            })
        }
    })

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        if (isAuthenticated === false) {
            navigate('../login', { replace: true, state: '/edit_profile' })
        }
    }, [isAuthenticated, navigate])

    useEffect(() => {
        if (location.state === null) {
            getUserProfile()
        }
    }, [location.state, getUserProfile])

    async function handleImageChange(e) {
        const file = e.target.files[0]
        if (file.size > 10485760) {
            setErrorImage({
                error: true,
                message: 'File size exceeds 10 Mb. Please choose another image.'
            })
            setTimeout(() => {
                setErrorImage({ error: false, message: '' })
            }, 3000)
            e.target.value = ''
        } else {
            setErrorImage({ error: false, message: 'Good' })
            const base64 = await convertBase64(file)
            setUserData({
                ...userData,
                avatar: base64
            })
        }
    }

    if (
        errorQueryMe ||
        errorDeleteUserProfileAvatar ||
        errorEditProfile) {
        return <Error />
    }

    return (userData &&
        <Row>
            <Col md={8} className='mx-auto' >
                <LogoBanner />
                <h1 className='text-center mb-3'>
                    Edit Profile
                </h1>
                <Form
                    onSubmit={(event) => {
                        event.preventDefault()
                        handleEditProfile()
                    }}
                    noValidate>
                    <div className='avatar-edit'>
                        <ProgressiveImage
                            src={((userData && userData.avatar) ?
                                userData.avatar : nobody)}
                            placeholder={(userData &&
                                userData.avatar) ?
                                createImagePlaceholderUrl(
                                    userData.avatar, '250x250') : nobody}
                        >
                            {(src, loading) =>
                                <img
                                    style={{
                                        filter: loading && 'blur(1px}',
                                        'WebkitFilter': loading && 'blur(1px)',
                                    }}
                                    className={"img-shadowed " +
                                        ((userData && userData.avatar) ?
                                            'darkened-avatar' : '')}
                                    height='112'
                                    width='112'
                                    src={src}
                                    alt="mdo" />}
                        </ProgressiveImage>
                        <div className='avatar-edit__div-delete'>
                            {userData.avatar &&
                                <p
                                    className='pointer mb-0'
                                    onClick={() => handleDeleteUserProfileAvatar()}
                                >
                                    {loadingDeleteUserProfileAvatar ?
                                        <span><Spinner
                                            as='span'
                                            animation='border'
                                            size='sm'
                                            role='status'
                                            aria-hidden='true' />
                                            <span className='visually-hidden'>Loading...</span>
                                        </span> :
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
                            disabled={loadingEditProfile}
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
                            label='Name'
                            controlId='floatingName'
                        >
                            <Form.Control
                                type="text"
                                value={userData.name}
                                isInvalid={nameLimitExceeded}
                                onChange={(e) =>
                                    setUserData({
                                        ...userData,
                                        name: e.target.value
                                    })
                                }
                                placeholder='Name'
                                disabled={loadingEditProfile}
                                required
                            />
                            {nameLimitExceeded &&
                                <Form.Control.Feedback type='invalid'>
                                    Must not exceed 55 characters.
                                </Form.Control.Feedback>}
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group className='mb-2 textarea-edit'>
                        <FloatingLabel
                            label='Bio'
                            controlId='floatingAboutMe'
                        >
                            <Form.Control
                                as='textarea'
                                isInvalid={aboutLimitExceeded}
                                value={userData.about}
                                onChange={(e) =>
                                    setUserData({
                                        ...userData,
                                        about: e.target.value
                                    })
                                }
                                placeholder='Bio'
                                disabled={loadingEditProfile}
                                required
                            />
                            {aboutLimitExceeded &&
                                <Form.Control.Feedback type='invalid'>
                                    Must not exceed 350 characters.
                                </Form.Control.Feedback>}
                        </FloatingLabel>
                    </Form.Group>
                    <Button
                        variant='primary'
                        className='big-button py-2 col-12 mb-2'
                        disabled={
                            aboutLimitExceeded ||
                            nameLimitExceeded ||
                            loadingEditProfile}
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
        </Row>
    )
}
import nobody from '../../assets/images/nobody.jpg'
import {format, parseISO } from 'date-fns'

import React, {useState, useEffect, useRef} from "react";
import { useTitle } from "../../functions/functions";
import { useParams, Link } from "react-router-dom";
import { USER_PROFILE } from "../../gqls/queries";
import { FOLLOWING_USER } from '../../gqls/mutations';
import { Error } from "../Error";
import ProgressiveImage from 'react-progressive-graceful-image'
import { useMutation, useQuery } from "@apollo/client";
import { Loader } from "../Loader";

import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'

import { 
    createImagePlaceholderUrl } from '../../functions/functions';

export function UserProfile(props) {
    const {isAuthenticated, username} = props
    const params = useParams()
    const userId = params.userId
    
    const [title, setTitle] = useState('Typenpost')
    const [isMyProfile, setIsMyProfile] = useState('initial')
    const [isFollowing, setIsFollowing] = useState('initial')
    const [followingBtnText, setFollowingBtnText] = useState('Following')
    useTitle(title)

    const { 
        data: userData, 
        loading: loadingUserProfile, 
        error: errorUserProfile, refetch } = useQuery(USER_PROFILE, {
            variables: { id: userId },
            polling: 500,
            onCompleted: (data) => {
                if (username === data.user.username) {
                    setTitle('Typenpost - My profile')
                    setIsMyProfile(true)
                } else {
                    setTitle('Typenpost - ' + data.user.username)
                    setIsMyProfile(false)
                }
                const amIFollowing = data.user.profile.amIFollowing
                if (amIFollowing === 'no') {
                    setIsFollowing(false)
                } else if (amIFollowing === 'yes') {
                    setIsFollowing(true)
                }
                const newTitle = ((username === data.user.username) ? 
                'Typenpost - My profile' : 
                'Typenpost - ' + data.user.username)
                setTitle(newTitle)
            }
    })

    const [handleFollow, {
        loading: loadingFollowingUser, 
        error: errorFollowingUser}] = useMutation(FOLLOWING_USER, {
        onCompleted: (data) => {
            if (data.followingUser.user !== null) {
                refetch({id: userId})
            }
        }
    })
    function handleFollowButton() {
        handleFollow({variables: {username: userData.user.username}})
    }

    function handleChangeFollowingBtnText() {
        if (followingBtnText == 'Following') {
            setFollowingBtnText('Unfollow')
        } else {
            setFollowingBtnText('Following')
        }
    }
    
    useEffect(() => {
        refetch({id: userId})
        setFollowingBtnText('Following')
    },[userData])

    if (
        loadingUserProfile) {
        return <Loader />
    }

    if (
        errorUserProfile ||
        errorFollowingUser) {
        return <Error />
    }
    
    console.log(followingBtnText)
    
    return (
        <>
        <h1 className='text-center mb-3'>
            {isMyProfile ? 'My Profile' : 'User Profile' }
        </h1>
        <Card style={{padding: '10px'}}>
        <Row>
            <Col md={4} xs={12} className='text-center'>
                <ProgressiveImage 
                  src={userData.user.profile.avatar ? 
                    userData.user.profile.avatar : nobody} 
                  placeholder={userData.user.profile.avatar ? 
                    createImagePlaceholderUrl(
                        userData.user.profile.avatar, '16x16') : nobody}
                >
                  {(src, loading) => 
                    <img 
                      style={{filter: loading && 'blur(8px}', 
                        'WebkitFilter': loading && 'blur(8px)'}} 
                      height='250' 
                      width='250' 
                      className="rounded-circle" 
                      src={src}
                      alt="mdo" />}
                </ProgressiveImage>
            </Col>
            <Col md={8} xs={12}>
                <Row>
                    <Col xs>
                        {userData.user.firstName && 
                            userData.user.lastName && 
                        <h2 className='mb-0'>
                            {userData.user.firstName + ' ' + userData.user.lastName}
                        </h2>}
                        <p className='text-muted mt-0 mb-1'>@{userData.user.username}</p>
                    </Col>
                    {isAuthenticated &&
                    <Col xs='auto'>
                        {isMyProfile ? 
                        <Button 
                            variant='outline-dark'
                            as={Link}
                            to='/'>Edit profile
                        </Button> : 
                        <>
                        {isFollowing ? 
                        <button 
                            className='fixed-btn-size following-btn btn'
                            onClick={handleFollowButton}
                            onMouseOver={handleChangeFollowingBtnText}
                            onMouseLeave={handleChangeFollowingBtnText}
                            >
                            {loadingFollowingUser ? 
                                <div><Spinner
                                    as='span'
                                    animation='border'
                                    size='sm'
                                    role='status'
                                    aria-hidden='true' />
                                <span className='visually-hidden'>
                                    Loading...</span>
                                </div> : 
                                followingBtnText
                            }
                        </button> :
                        <Button
                            className='fixed-btn-size'
                            variant='primary'
                            onClick={handleFollowButton}>
                            {loadingFollowingUser ? 
                                <div><Spinner
                                    as='span'
                                    animation='border'
                                    size='sm'
                                    role='status'
                                    aria-hidden='true' />
                                <span className='visually-hidden'>
                                    Loading...</span>
                                </div> : 
                                'Follow'
                            }
                        </Button>}
                        </>
                        }
                    </Col>}
                </Row>
                <p>
                    <b>{userData.user.profile.numberOfFollowing}</b>
                    <span className='text-muted'> Following &nbsp;</span>
                    <b>{userData.user.profile.numberOfFollowers}</b>
                    <span className='text-muted'> Followers</span>
                </p>
                {userData.user.profile.about && <p>{userData.user.profile.about}</p>}
                <p className='mb-1'>Joined: {format(parseISO(userData.user.dateJoined), 'MMMM d, yyyy')}</p>
            </Col>
        </Row>
        </Card>
        </>
    )
}

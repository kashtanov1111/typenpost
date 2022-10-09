import nobody from '../../assets/images/nobody.jpg'
import {format, parseISO } from 'date-fns'

import React, {useState} from "react";
import { useTitle } from "../../functions/functions";
import { useParams, Link } from "react-router-dom";
import { USER_PROFILE, AM_I_FOLLOWING } from "../../gqls/queries";
import { FOLLOWING_USER } from '../../gqls/mutations';
import { Error } from "../Error";
import ProgressiveImage from 'react-progressive-graceful-image'
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { Loader } from "../Loader";

import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { 
    createImagePlaceholderUrl } from '../../functions/functions';

export function UserProfile(props) {
    const {isAuthenticated, username} = props
    const params = useParams()
    const userId = params.userId
    
    const [title, setTitle] = useState('Typenpost')
    const [isMyProfile, setIsMyProfile] = useState(false)
    const [isFollowing, setIsFollowing] = useState(false)
    useTitle(title)
    
    const [checkSubscription, { 
        loading: loadingAmIFollowing, 
        error: errorAmIFollowing}] = useLazyQuery(AM_I_FOLLOWING, {
            onCompleted: (data) => {
                console.log(data)
                if (data.amIFollowing === 'no') {
                    setIsFollowing(false)
                } else if (data.amIFollowing === 'yes') {
                    setIsFollowing(true)
                }  
            }
        })
    const { 
        data, 
        loading: loadingUserProfile, 
        error: errorUserProfile, refetch } = useQuery(USER_PROFILE, {
            variables: { id: userId },
            polling: 500,
            onCompleted: (data) => {
                console.log(data.user.profile.numberOfFollowers)
                if (username === data.user.username) {
                    setTitle('Typenpost - My profile')
                    setIsMyProfile(true)
                } else {
                    setTitle('Typenpost - ' + data.user.username)
                    setIsMyProfile(false)
                }
                const newTitle = ((username === data.user.username) ? 
                'Typenpost - My profile' : 
                'Typenpost - ' + data.user.username)
                setTitle(newTitle)
                if (isAuthenticated && !isMyProfile) {
                    checkSubscription(
                        {variables: {username: data.user.username}})
                }
                }
    })

    const [handleFollow, {loading, error}] = useMutation(FOLLOWING_USER, {
        onCompleted: async (data) => {
            if (data.followingUser.user !== null) {
                console.log('lll')
                console.log('r', isFollowing)
                console.log('t', isFollowing)
                await refetch({id: userId})
                // setIsFollowing(current => !current)
            }
        }
    })
    function handleFollowButton() {
        handleFollow({variables: {username: data.user.username}})
    }

    if (loadingUserProfile || loadingAmIFollowing) {
        return <Loader />
    }

    if (errorUserProfile || errorAmIFollowing) {
        return <Error />
    }
    console.log('isFollowing', isFollowing)
    return (
        <>
        <h1 className='text-center mb-3'>
            {isMyProfile ? 'My Profile' : 'User Profile' }
        </h1>
        <Card style={{padding: '10px'}}>
        <Row>
            <Col md={4} xs={12} className='text-center'>
                <ProgressiveImage 
                  src={data.user.profile.avatar ? 
                    data.user.profile.avatar : nobody} 
                  placeholder={data.user.profile.avatar ? 
                    createImagePlaceholderUrl(
                        data.user.profile.avatar, '16x16') : nobody}
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
                        {data.user.firstName && 
                        data.user.lastName && 
                        <h2 className='mb-0'>
                            {data.user.firstName + ' ' + data.user.lastName}
                        </h2>}
                        <p className='text-muted mt-0 mb-1'>@{data.user.username}</p>
                    </Col>
                    <Col xs='auto'>
                        {isMyProfile ? 
                        <Button 
                            variant='outline-dark'
                            as={Link}
                            to='/'>Edit profile
                        </Button> : 
                        <Button 
                            variant='primary'
                            onClick={handleFollowButton}>
                            {isFollowing ? 'Unfollow' : 'Follow'}
                        </Button> 
                        }
                    </Col>
                </Row>
                <p>
                    <b>{data.user.profile.numberOfFollowing}</b>
                    <span className='text-muted'> Following &nbsp;</span>
                    <b>{data.user.profile.numberOfFollowers}</b>
                    <span className='text-muted'> Followers</span>
                </p>
                {data.user.profile.about && <p>{data.user.profile.about}</p>}
                <p className='mb-1'>Joined: {format(parseISO(data.user.dateJoined), 'MMMM d, yyyy')}</p>
            </Col>
        </Row>
        </Card>
        </>
    )
}
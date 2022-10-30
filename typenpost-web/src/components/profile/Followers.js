import nobody from '../../assets/images/nobody.jpg'
import {format, parseISO } from 'date-fns'

import React, {useState, useEffect} from "react";
import { useTitle } from "../../functions/functions";
import { useParams, Link, useNavigate } from "react-router-dom";
import { USER_FOLLOWERS } from "../../gqls/queries";
import { Error } from "../Error";
import ProgressiveImage from 'react-progressive-graceful-image'
import { useMutation, useQuery } from "@apollo/client";
import Lightbox from 'react-image-lightbox'
import {BsChevronDown, BsChevronUp} from 'react-icons/bs'

import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import Placeholder from 'react-bootstrap/Placeholder'

import { 
    createImagePlaceholderUrl } from '../../functions/functions';

export function Followers(props) {
    const {isAuthenticated, username} = props
    const params = useParams()
    const userUsername = params.userUsername
    const navigate = useNavigate()
    const [followingBtnText, setFollowingBtnText] = useState('Following')
    
    useTitle('Typenpost - Followers')

    const { 
        data, 
        loading: loadingUserFollowers, 
        error: errorUserFollowers } = useQuery(USER_FOLLOWERS, {
            variables: { username: userUsername },
            polling: 500,
            onCompleted: (data) => {
                console.log(data)
            }
    })

    // const [handleFollow, {
    //     loading: loadingFollowingUser, 
    //     error: errorFollowingUser}] = useMutation(FOLLOWING_USER, {
    //     onCompleted: (data) => {
    //         if (data.followingUser.success === true) {
    //             refetch({id: userId})
    //         }
    //     }
    // })
    
    // function handleFollowButton() {
    //     handleFollow({variables: {username: data.user.username}})
    // }

    // function handleChangeFollowingBtnText() {
    //     if (followingBtnText == 'Following') {
    //         setFollowingBtnText('Unfollow')
    //     } else {
    //         setFollowingBtnText('Following')
    //     }
    // }

    // function handleImageClick() {
    //     setIsImageOpen(true)
    // }
    
    // useEffect(() => {
    //     setFollowingBtnText('Following')
    //     refetch({id: userId})
    // },[data])

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('../login', {
                // replace: true, 
                state: '/profile/' + userUsername + '/followers'})
        }
    }, [isAuthenticated])

    if (errorUserFollowers) {
        return <Error />
    }
    // if (data && data.user === null) {
    //     return <Error description='User is not found.' />
    // }
    return (
        <>
        {data && data.userFollowers.edges.map((el) => (el.node && 
        <Card key={el.node.id} as={Link} className='mb-2 p-md-2 p-1' to={'/profile/' + el.node.user.username}>
        <Row>
            <Col xs='auto' className='text-center pe-0'>
                <ProgressiveImage 
                  src={el.node.avatar ? 
                    el.node.avatar : nobody} 
                  placeholder={el.node.avatar ? 
                    createImagePlaceholderUrl(
                        el.node.avatar, '16x16') : nobody}
                >
                  {(src, loading) => 
                    <img 
                      style={{filter: loading && 'blur(8px}', 
                        'WebkitFilter': loading && 'blur(8px)'}} 
                    //   height='100rem' 
                    //   width='100rem' 
                      className="rounded-circle follow-images" 
                      src={src}
                      alt="mdo" />}
                </ProgressiveImage>
            </Col>
            <Col xs>
                <Row>
                    <Col xs className='pe-0 ps-md-3 ps-1'>
                        {(loadingUserFollowers || el.node.user.firstName || 
                            el.node.lastName) && 
                        <Placeholder as='h5' animation='glow' 
                            className='mb-0'>
                            {loadingUserFollowers ? 
                            <>
                                <Placeholder xs={2} bg='secondary'/>{' '}
                                <Placeholder xs={4} bg='secondary'/>
                            </> : 
                            el.node.user.firstName + ' ' + 
                            el.node.user.lastName}
                        </Placeholder>}
                        <Placeholder as='p' animation='glow' 
                            className='text-muted mt-0 mb-1'>
                            {loadingUserFollowers ? 
                            <Placeholder xs={3} bg='secondary'/> :
                            '@' + el.node.user.username}
                        </Placeholder>
                    </Col>
                    <Col xs='auto'>
                        {username === el.node.user.username ? 
                        <></> : 
                        <>
                        {el.node.amIFollowing === 'yes' ? 
                        <button 
                            className='fixed-btn-size following-btn btn'
                            onClick={(e) => {
                                e.preventDefault()
                                console.log('yyy')
                            }}
                            // onMouseOver={handleChangeFollowingBtnText}
                            // onMouseLeave={handleChangeFollowingBtnText}
                            >
                            {1 !== 1 ? 
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
                            className={!el.node.isHeFollowing ?'fixed-btn-size' : ''}
                            variant='primary'
                            onClick={(e) => {
                                e.preventDefault()
                                console.log('yyy')
                            }}
                            >
                            {1 !== 1 ? 
                                <div><Spinner
                                    as='span'
                                    animation='border'
                                    size='sm'
                                    role='status'
                                    aria-hidden='true' />
                                <span className='visually-hidden'>
                                    Loading...</span>
                                </div> : 
                                el.node.isHeFollowing ? 'Follow back' : 'Follow'
                            }
                        </Button>}
                        </>
                        }
                    </Col>
                </Row>
            </Col>
        </Row>
        </Card>
        ))}
        </>
    )
}

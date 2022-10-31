import nobody from '../../assets/images/nobody.jpg'
import {format, parseISO } from 'date-fns'

import React, {useState, useEffect} from "react";
import { useTitle } from "../../functions/functions";
import { useParams, Link, useNavigate } from "react-router-dom";
import { USER_FOLLOWERS } from "../../gqls/queries";
import { FOLLOWING_USER } from "../../gqls/mutations";
import { Error } from "../Error";
import ProgressiveImage from 'react-progressive-graceful-image'
import { useMutation, useQuery } from "@apollo/client";
import Lightbox from 'react-image-lightbox'
import {BsChevronDown, BsChevronUp} from 'react-icons/bs'
import { useWidth } from '../../functions/functions';

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
    const [width, setWidth] = useState(window.innerWidth)
    
    useTitle('Typenpost - Followers')

    const { 
        data, 
        loading: loadingUserFollowers, 
        error: errorUserFollowers,
        refetch, fetchMore } = useQuery(USER_FOLLOWERS, {
            variables: { username: userUsername },
            polling: 500,
            // onCompleted: (data) => {
            //     console.log(data)
            // }
    })

    function handleUserFirstLastName(firstName, lastName, width) {
        if (width >= 992) {
            return firstName + ' ' + lastName
        }
        var finalFirstName = ''
        var finalLastName = ''
        if (firstName.length > 14) {
            finalFirstName = firstName.slice(0, 13) + '...'
        } else {
            finalFirstName = firstName
        }
        if (lastName.length > 14) {
            finalLastName = lastName.slice(0, 13) + '...'
        } else {
            finalLastName = lastName
        }
        return finalFirstName + ' ' + finalLastName
        // return firstName + ' ' + lastName
    }   

    const [handleFollow, {
        loading: loadingFollowingUser, 
        error: errorFollowingUser}] = useMutation(FOLLOWING_USER
            , {
        onCompleted: (data) => {
            if (data.followingUser.success === true) {
                refetch({username: userUsername})
            }
        }
    }
    )
    

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
    
    useEffect(() => {
        refetch({username: userUsername})
    },[data])

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('../login', {
                // replace: true, 
                state: '/profile/' + userUsername + '/followers'})
        }
    }, [isAuthenticated])

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange)
        return () => {
              window.removeEventListener('resize', handleWindowSizeChange)
          }
    }, [window.innerWidth])


    function handleWindowSizeChange() {
        setWidth(window.innerWidth)
    }

    if (errorUserFollowers) {
        return <Error />
    }
    // if (data && data.user === null) {
    //     return <Error description='User is not found.' />
    // }
    return (
        <>
        {data && data.user.profile.followers.edges.map((el) => (el.node && 
        <Card key={el.node.id} as={Link} className='bottom-border p-2' to={'/profile/' + el.node.user.username}>
        <Row>
            <Col xs='auto' className='text-center pe-1 my-auto'>
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
                      className="rounded-circle follow-images" 
                      src={src}
                      alt="mdo" />}
                </ProgressiveImage>
            </Col>
            <Col xs className='my-auto'>
                <Row>
                    <Col xs className='pe-0 ps-md-3 ps-1'>
                        {(loadingUserFollowers || el.node.user.firstName || 
                            el.node.lastName) && 
                        <Placeholder as='h6' animation='glow' 
                            className='mb-0'>
                            {loadingUserFollowers ? 
                            <>
                                <Placeholder xs={2} bg='secondary'/>{' '}
                                <Placeholder xs={4} bg='secondary'/>
                            </> : 
                            handleUserFirstLastName(
                                el.node.user.firstName,
                                el.node.user.lastName,
                                width)
                            }
                        </Placeholder>}
                        <Placeholder as='p' animation='glow' 
                            className='text-muted mt-0 mb-1'>
                            {loadingUserFollowers ? 
                            <Placeholder xs={3} bg='secondary'/> :
                            '@' + el.node.user.username}
                        </Placeholder>
                    </Col>
                    <Col xs='auto' className='my-auto'>
                        {username === el.node.user.username ? 
                        <></> : 
                        <>
                        {el.node.amIFollowing ? 
                        <button 
                            className='fixed-btn-size following-btn btn btn-sm'
                            size='sm'
                            onClick={(e) => {
                                e.preventDefault()
                                handleFollow({variables: {username: el.node.user.username}})
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
                                <span>Following</span>
                            }
                        </button> :
                        <Button
                            className='fixed-btn-size '
                            variant='primary'
                            size='sm'
                            onClick={(e) => {
                                e.preventDefault()
                                handleFollow({variables: {username: el.node.user.username}})
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
        <Button onClick={() => {
            console.log('asdfs')
            fetchMore({
                variables: {
                    cursor: data.user.profile.followers.pageInfo.endCursor
                }
            })
        }}>Load more</Button>
        </>
    )
}

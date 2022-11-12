import nobody from '../../assets/images/nobody.jpg'
import React, {useState, useEffect} from "react";
import { useTitle } from "../../functions/functions";
import { useParams, Link, useNavigate } from "react-router-dom";
import { USER_FOLLOWING } from "../../gqls/queries";
import { FOLLOWING_USER } from "../../gqls/mutations";
import { Error } from "../Error";
import ProgressiveImage from 'react-progressive-graceful-image'
import { useMutation, useQuery } from "@apollo/client";
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import Placeholder from 'react-bootstrap/Placeholder'
import InfiniteScroll from 'react-infinite-scroll-component'

import { 
    createImagePlaceholderUrl } from '../../functions/functions';

export function Following(props) {
    const {isAuthenticated, username} = props
    const params = useParams()
    const userUsername = params.userUsername
    const navigate = useNavigate()
    const [width, setWidth] = useState(window.innerWidth)
    
    useTitle('Typenpost - Following')

    const { 
        data, 
        loading: loadingUserFollowing, fetchMore,
        error: errorUserFollowing, refetch} = useQuery(USER_FOLLOWING, {
            variables: { username: userUsername }
    })
    
    const [handleFollow, {
        error: errorFollowingUser}] = useMutation(FOLLOWING_USER)

    function handleUserFirstLastName(firstName, lastName, width) {
        if (width >= 992) {
            return firstName + ' ' + lastName
        }
        var finalFirstName = ''
        var finalLastName = ''
        if (firstName.length > 15) {
            finalFirstName = firstName.slice(0, 14) + '...'
        } else {
            finalFirstName = firstName
        }
        if (lastName.length > 15) {
            finalLastName = lastName.slice(0, 14) + '...'
        } else {
            finalLastName = lastName
        }
        return finalFirstName + ' ' + finalLastName
    }   

    function handleWindowSizeChange() {
        setWidth(window.innerWidth)
    }

    function handleFollowBtnClicked(e, username) {
        e.preventDefault()
        var mainElement = ''
        if (e.target.tagName === 'SPAN') {
            mainElement = e.target.parentElement
        } else {
            mainElement = e.target
        }
        if (mainElement.className.includes('following')) {
            mainElement.className = mainElement.className.replace('following', 'primary')
            mainElement.children[0].textContent = 'Follow'
        } else {
            mainElement.className = mainElement.className.replace('primary', 'following')
            mainElement.children[0].textContent = 'Following'
        }
        handleFollow({variables: {username: username}})
    }
    
    useEffect(() => {
        refetch({username: userUsername})
    }, [navigate])

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('../login', {
                state: '/profile/' + userUsername + '/following'})
        }
    }, [isAuthenticated])

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange)
        return () => {
              window.removeEventListener('resize', handleWindowSizeChange)
          }
    }, [window.innerWidth])

    if (errorUserFollowing || errorFollowingUser) {
        return <Error />
    }

    return (<>
        
        <InfiniteScroll
            dataLength={data ? data.user.profile.following.edges.length : 1}
            next={() => fetchMore({
                        variables: {
                            username: userUsername,
                            cursor: data.user.profile.following.pageInfo.endCursor,
                        },
                    })}
            hasMore={data && data.user.profile.following.pageInfo.hasNextPage}
            loader={<div className='text-center my-3'>
                    <Spinner variant='primary' animation='border' />
                    </div>}
            style={{'overflowX': 'hidden'}}
        >
        {data && data.user.profile.following.edges.map((el) => (el.node && 
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
                        {(loadingUserFollowing || el.node.user.firstName || 
                            el.node.lastName) && 
                        <Placeholder as='h6' animation='glow' 
                            className='mb-0'>
                            {loadingUserFollowing ? 
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
                            {loadingUserFollowing ? 
                            <Placeholder xs={3} bg='secondary'/> :
                            '@' + el.node.user.username}
                        </Placeholder>
                    </Col>
                    <Col xs='auto' className='my-auto'>
                        {username === el.node.user.username ? 
                        <></> : 
                        <>
                        {el.node.amIFollowing ? 
                        <Button 
                            style={{width: '85px'}}
                            variant='following'
                            size='sm'
                            onClick={(e) => handleFollowBtnClicked(e, el.node.user.username)}
                            >
                            <span>Following</span>
                        </Button> :
                        <Button
                            style={{width: '85px'}}
                            variant='primary'
                            size='sm'
                            onClick={(e) => handleFollowBtnClicked(e, el.node.user.username)}
                            >
                            <span>Follow</span>
                        </Button>}
                        </>
                        }
                    </Col>
                </Row>
            </Col>
        </Row>
        </Card>
        ))}
        </InfiniteScroll>
        </>
    )
}

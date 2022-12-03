import nobody from '../../../assets/images/nobody.jpg'
import {format, parseISO } from 'date-fns'
import React, {useState} from "react";
import { Link } from "react-router-dom";
import ProgressiveImage from 'react-progressive-graceful-image'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import Placeholder from 'react-bootstrap/Placeholder'
import { 
    createImagePlaceholderUrl } from '../../../functions/functions';

export function UserProfileTop(props) {
    const {
        userData, 
        handleImageClick, 
        loadingUserProfile, 
        loadingFollowingUser,  
        isAuthenticated,
        handleFollow,
        isMyProfile,
        amIFollowing,  
        isHeFollowing,
    } = props
    const [showMore, setShowMore] = useState(false)

    function handleFollowButton() {
        handleFollow({variables: {username: userData.user.username}})
    }

    return (
        <Card className='bottom-border py-3 px-2'>
        <Row>
            <Col md='auto' xs={12} className='text-center'>
                <ProgressiveImage 
                  src={userData && userData.user.profile.avatar ? 
                    userData.user.profile.avatar : nobody} 
                  placeholder={userData && userData.user.profile.avatar ? 
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
                      onClick={handleImageClick}
                      src={src}
                      alt="mdo" />}
                </ProgressiveImage>
            </Col>
            <Col md xs={12}>
                <Row>
                    <Col xs={8} md={8} className='me-auto pe-0'>
                        {(loadingUserProfile || userData && userData.user.firstName || 
                            userData && userData.user.lastName) && 
                        <Placeholder as='h4' animation='glow' 
                            className='mb-0'>
                            {loadingUserProfile ? 
                            <>
                                <Placeholder xs={2} bg='secondary'/>{' '}
                                <Placeholder xs={4} bg='secondary'/>
                            </> : 
                            userData && userData.user.firstName + ' ' + 
                            userData && userData.user.lastName}
                        </Placeholder>}
                        <Placeholder as='p' animation='glow' 
                            className='text-muted mt-0 mb-1'>
                            {loadingUserProfile ? 
                            <Placeholder xs={3} bg='secondary'/> :
                            '@' + userData && userData.user.username}
                        </Placeholder>
                    </Col>
                    {isAuthenticated &&
                    <Col xs='auto' className='ps-0'>
                        {isMyProfile ? 
                        <Button 
                            variant='outline-dark'
                            as={Link}
                            to='/profile/edit'
                            state={userData && userData}>Edit profile
                        </Button> : 
                        <>
                        {amIFollowing ? 
                        <Button 
                            variant='following'
                            onClick={handleFollowButton}
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
                                <span>Following</span>
                            }
                        </Button> :
                        <Button
                            className={!isHeFollowing ? 
                                'fixed-btn-size' : ''}
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
                                isHeFollowing ? 'Follow back' : 'Follow'
                            }
                        </Button>}
                        </>
                        }
                    </Col>}
                </Row>
                <p>
                    <Placeholder as='b' animation='glow'>
                        {loadingUserProfile ? 
                        <Placeholder xs={1} bg='secondary'/> :
                        userData && userData.user.profile.numberOfFollowing}
                    </Placeholder>
                    <Link to='following' className='follow-text-profile'>
                    &nbsp;Following&nbsp;&nbsp;
                    </Link>
                    <Placeholder as='b' animation='glow'>
                        {loadingUserProfile ? 
                        <Placeholder xs={1} bg='secondary'/>:
                        userData && userData.user.profile.numberOfFollowers}
                    </Placeholder>
                    <Link to='followers' className='follow-text-profile'> 
                    &nbsp;Followers
                    </Link>
                </p>
                {(loadingUserProfile || (userData && userData.user.profile.about)) && 
                <Placeholder as='p' className='mb-2' animation='glow'>
                    {loadingUserProfile ? 
                    <>
                    <Placeholder xs={3} bg='secondary'/>{' '}
                    <Placeholder xs={5} bg='secondary'/>{' '} 
                    <Placeholder xs={2} bg='secondary'/>{' '}
                    <Placeholder xs={6} bg='secondary'/>{' '} 
                    <Placeholder xs={3} bg='secondary'/>{' '}
                    <Placeholder xs={5} bg='secondary'/>
                    </> :
                    userData.user.profile.about}
                </Placeholder>}
                <Placeholder as='p' animation='glow' 
                    className='mb-1 text-muted'>
                    Joined:{' '}
                    {loadingUserProfile ? 
                    <Placeholder xs={2} bg='secondary'/> :
                    format(parseISO(userData && userData.user.dateJoined), 
                        'MMMM d, yyyy')}
                </Placeholder>
                {isMyProfile && 
                    <>
                    <div>
                    <div
                    onClick={() => setShowMore(prev => !prev)}
                    style={{cursor: 'pointer'}}
                    >
                    <div className='centered-label follow-text-profile'>
                    {!showMore && <>More...</>} 
                    </div>
                    </div>
                    </div>
                    {showMore ? 
                    <>
                    <p className='mb-1 text-muted'>
                        Email: {userData && userData.user.email}
                    </p>
                    {userData && userData.user.secondaryEmail &&
                    <p animation='glow' className='mb-1 text-muted'>
                        Secondary Email: {userData.user.secondaryEmail}
                    </p>}
                    </>: <></>
                    }
                    </>
                }
            </Col>
        </Row>
        </Card>
    )
}
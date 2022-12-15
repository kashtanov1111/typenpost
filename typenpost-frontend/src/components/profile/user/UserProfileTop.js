import React, { useState, useContext } from "react";
import { useMutation } from '@apollo/client';
import { Link } from "react-router-dom";
import ProgressiveImage from 'react-progressive-graceful-image'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import Placeholder from 'react-bootstrap/Placeholder'
import { FOLLOWING_USER } from '../../../gqls/mutations';
import { ProfileIdContext } from '../../../context/LoginContext';
import nobody from '../../../assets/images/nobody.jpg'

export function UserProfileTop({
    setIsImageOpen,
    loadingUserProfile,
    isAuthenticated,
    isMyProfile,
    amIFollowing,
    isHeFollowing,
    improvedUserData,
    userUsername,
    placeholderProfileSrc,
    avatarSrc,
    handleAlert,
}) {
    const authenticatedUserProfileId = useContext(ProfileIdContext)
    const [showMore, setShowMore] = useState(false)
    const [handleFollow, {
        loading: loadingFollowingUser }] = useMutation(FOLLOWING_USER, {
            variables: { username: userUsername },
            update(cache, { data: { followingUser } }) {
                cache.modify({
                    id: 'UserProfileNode:' + authenticatedUserProfileId,
                    fields: {
                        numberOfFollowing(cachedValue) {
                            console.log('uuuuuuuuu', cachedValue)
                            if (followingUser.action ===
                                'unfollowed') {
                                return cachedValue - 1
                            } else {
                                return cachedValue + 1
                            }
                        }
                    }
                })
                cache.modify({
                    id: 'UserProfileNode:' + improvedUserData.profileId,
                    fields: {
                        numberOfFollowers(cachedValue) {
                            if (followingUser.action ===
                                'followed') {
                                return cachedValue + 1
                            } else {
                                return cachedValue - 1
                            }
                        },
                        amIFollowing(cachedValue) {
                            if (followingUser.action ===
                                'followed') {
                                return true
                            } else {
                                return false
                            }
                        }
                    }
                })

            },
            onError: () => {
                handleAlert('An error occured, please try again.', 'danger')
            },
        })

    return (<>
        <section className='user-header-lg'>
            <div className="user-header__avatar">
                <img src={nobody} alt="" width='30' height='30' />
            </div>
            <div className='user-header-lg__top-right'>
                <div className='user-header-lg-top-right__first-line'>
                    <div className="user-header__username">
                        <p>@wwwwwwwwwwwwwwwwwwww</p>
                        {/* <p>@1kashtanov</p> */}
                    </div>
                    <Button className='user-header-lg__edit-button' variant='outline-dark'>Edit Profile</Button>
                </div>
                <div className='user-header-stats'>
                    <div className="user-header__posts">
                        <p className="user-header__num">5 806</p>
                        <p className='user-header__posts-word'>Posts</p>
                    </div>
                    <div className="user-header__followers">
                        <p className="user-header__num">5 806</p>
                        <p className='user-header__followers-word'>Followers</p>
                    </div>
                    <div className="user-header__following">
                        <p className="user-header__num">5 806</p>
                        <p className='user-header__following-word'>Following</p>
                    </div>
                </div>
            </div>
            <div className="user-header__name">
                <h4>
                WWWWWWWWWWWWWWWWWWWWWWW WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
                </h4>
                {/* <h4>
                    Daniil Kashtanov
                </h4> */}
            </div>
            <div className="user-header__about">
                {/* <p>WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW</p> */}
                <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web pag</p>
            </div>
            <div className="user-header__date-joined text-muted">
                <p>Joined: 21 January, 2021</p>
            </div>
            <div className="user-header__emails text-muted">
                <p className={(!showMore ? '' : 'offscreen') + ' pointer'} onClick={() => setShowMore(true)}>More...</p>
                <div className={showMore ? '' : 'offscreen'}>
                    <p>Email: 2kashtanov2222@gmail.com</p>
                    <p>Secondary Email: 2kashtanov2222@gmail.com</p>
                </div>
            </div>
        </section>
        <section className='user-header'>
            <div className="user-header__avatar">
                <img src={nobody} alt="" width='30' height='30' />
            </div>
            <div className='user-header-stats'>
                <div className="user-header__posts">
                    <p className="user-header__num">34</p>
                    <p className='user-header__posts-word'>Posts</p>
                </div>
                <div className="user-header__followers">
                    <p className="user-header__num">120</p>
                    <p className='user-header__followers-word'>Followers</p>
                </div>
                <div className="user-header__following">
                    <p className="user-header__num">121</p>
                    <p className='user-header__following-word'>Following</p>
                </div>
            </div>
            <div className="user-header__name">
                <h4>
                WWWWWWWWWWWWWWWWWWWWWWW WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
                </h4>
                {/* <h4>
                    Daniil Kashtanov
                </h4> */}
            </div>
            <div className="user-header__username">
                <p>@wwwwwwwwwwwwwwwwwwww</p>
                {/* <p>@1kashtanov</p> */}
            </div>
            <div className="user-header__about">
                {/* <p>WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW</p> */}
                <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web pag</p>
            </div>
            <div className="user-header__date-joined text-muted">
                <p>Joined: 21 January, 2021</p>
            </div>
            <div className="user-header__emails text-muted">
                <p className={(!showMore ? '' : 'offscreen') + ' pointer'} onClick={() => setShowMore(true)}>More...</p>
                <div className={showMore ? '' : 'offscreen'}>
                    <p>Email: 2kashtanov2222@gmail.com</p>
                    <p>Secondary Email: 2kashtanov2222@gmail.com</p>
                </div>
            </div>
            <div className='user-header__buttons'>
                <Button variant='outline-dark'>Edit Profile</Button>
                <Button variant='outline-dark'>Settings</Button>
            </div>
        </section>
        </>
        // <Card className='bottom-border py-3 px-2'>
        //     <Row>
        //         <Col xs={3} className=''>
        //             <ProgressiveImage
        //                 src={avatarSrc}
        //                 placeholder={placeholderProfileSrc}
        //             >
        //                 {(src, loading) =>
        //                     <img
        //                         style={{
        //                             filter: loading && 'blur(1px}',
        //                             'WebkitFilter': loading && 'blur(1px)'
        //                         }}
        //                         className="rounded-circle pointer"
        //                         onClick={() => setIsImageOpen(true)}
        //                         src={src}
        //                         alt="mdo" />}
        //             </ProgressiveImage>
        //         </Col>
        //         <Col xs={9} md className=''>
        //             <Placeholder as='h4' animation='glow'
        //                 className='mb-0'>
        //                 {loadingUserProfile ?
        //                     <>
        //                         <Placeholder xs={2} bg='secondary' />{' '}
        //                         <Placeholder xs={4} bg='secondary' />
        //                     </> :
        //                     improvedUserData && improvedUserData.name}
        //             </Placeholder>
        //             <p className='text-muted mt-0 mb-1'>
        //                 {'@' + userUsername}
        //             </p>
        //         </Col>
        //         <Col className=''>
        //             <p className='mb-2'>
        //                 {/* <Placeholder as='b' animation='glow'>
        //                     {loadingUserProfile ?
        //                         <Placeholder xs={1} bg='secondary' /> :
        //                         improvedUserData && improvedUserData.numberOfFollowing}
        //                 </Placeholder> */}
        //                 <b>0</b>
        //                 <Link to='following' className='follow-text'>
        //                     &nbsp;Posts&nbsp;&nbsp;
        //                 </Link>
        //                 <Placeholder as='b' animation='glow'>
        //                     {loadingUserProfile ?
        //                         <Placeholder xs={1} bg='secondary' /> :
        //                         improvedUserData && improvedUserData.numberOfFollowing}
        //                 </Placeholder>
        //                 <Link to='following' className='follow-text'>
        //                     &nbsp;Following&nbsp;&nbsp;
        //                 </Link>
        //                 <Placeholder as='b' animation='glow'>
        //                     {loadingUserProfile ?
        //                         <Placeholder xs={1} bg='secondary' /> :
        //                         improvedUserData && improvedUserData.numberOfFollowers}
        //                 </Placeholder>
        //                 <Link to='followers' className='follow-text'>
        //                     &nbsp;Followers
        //                 </Link>
        //             </p>
        //         </Col>
        //         {isAuthenticated === true && isMyProfile !== null &&
        //             <Col xs={12} className='text-center'>
        //                 {isMyProfile ?
        //                     <Button
        //                         variant='outline-dark'
        //                         as={Link}
        //                         to='/edit_profile'
        //                         state={improvedUserData && improvedUserData}>Edit profile
        //                     </Button> :
        //                     <>
        //                         {amIFollowing ?
        //                             <Button
        //                                 variant='following'
        //                                 onClick={handleFollow}
        //                             >
        //                                 {loadingFollowingUser ?
        //                                     <div><Spinner
        //                                         as='span'
        //                                         animation='border'
        //                                         size='sm'
        //                                         role='status'
        //                                         aria-hidden='true' />
        //                                         <span className='visually-hidden'>
        //                                             Loading...</span>
        //                                     </div> :
        //                                     <span>Following</span>
        //                                 }
        //                             </Button> :
        //                             <Button
        //                                 className={!isHeFollowing ?
        //                                     'fixed-btn-size' : ''}
        //                                 variant='primary'
        //                                 onClick={handleFollow}>
        //                                 {loadingFollowingUser ?
        //                                     <div><Spinner
        //                                         as='span'
        //                                         animation='border'
        //                                         size='sm'
        //                                         role='status'
        //                                         aria-hidden='true' />
        //                                         <span className='visually-hidden'>
        //                                             Loading...</span>
        //                                     </div> :
        //                                     (isHeFollowing !== null && isHeFollowing) ? 'Follow back' : 'Follow'
        //                                 }
        //                             </Button>
        //                         }
        //                     </>
        //                 }
        //             </Col>
        //                 // <Col>
        //                 //     <div className='centered-label'>
        //                 //         <FiSettings />
        //                 //     </div>
        //                 // </Col>
        //         }
        //         {(loadingUserProfile || (improvedUserData && improvedUserData.about)) &&
        //             <Placeholder as='p' className='mb-2' animation='glow'>
        //                 {loadingUserProfile ?
        //                     <>
        //                         <Placeholder xs={3} bg='secondary' />{' '}
        //                         <Placeholder xs={5} bg='secondary' />{' '}
        //                         <Placeholder xs={2} bg='secondary' />{' '}
        //                         <Placeholder xs={6} bg='secondary' />{' '}
        //                         <Placeholder xs={3} bg='secondary' />{' '}
        //                         <Placeholder xs={5} bg='secondary' />
        //                     </> :
        //                     improvedUserData.about}
        //             </Placeholder>}
        //         {/* <Placeholder as='p' animation='glow'
        //             className='mb-1 text-muted'>
        //             Joined:{' '}
        //             {loadingUserProfile ?
        //                 <Placeholder xs={2} bg='secondary' /> :
        //                 format(parseISO(improvedUserData && improvedUserData.dateJoined),
        //                     'MMMM d, yyyy')}
        //         </Placeholder> */}
        //         {isMyProfile &&
        //             <>
        //                 <div>
        //                     <div
        //                         onClick={() => setShowMore(prev => !prev)}
        //                         style={{ cursor: 'pointer' }}
        //                     >
        //                         <div className='centered-label follow-text'>
        //                             {!showMore && <>More...</>}
        //                         </div>
        //                     </div>
        //                 </div>
        //                 {showMore ?
        //                     <>
        //                         <p className='mb-1 text-muted'>
        //                             Email: {improvedUserData && improvedUserData.email}
        //                         </p>
        //                         {improvedUserData && improvedUserData.secondaryEmail &&
        //                             <p animation='glow' className='mb-1 text-muted'>
        //                                 Secondary Email: {improvedUserData.secondaryEmail}
        //                             </p>}
        //                     </> : <></>
        //                 }
        //             </>
        //         }
        //     </Row>
        // </Card>
    )
}
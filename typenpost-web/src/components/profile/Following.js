import nobody from '../../assets/images/nobody.jpg'
import {format, parseISO } from 'date-fns'

import React, {useState, useEffect} from "react";
import { useTitle } from "../../functions/functions";
import { useParams, Link } from "react-router-dom";
import { USER_PROFILE } from "../../gqls/queries";
import { FOLLOWING_USER } from '../../gqls/mutations';
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

export function Following(props) {
    const {isAuthenticated} = props
    
    useTitle('Typenpost - Following')

    // const { 
    //     data: userData, 
    //     loading: loadingUserProfile, 
    //     error: errorUserProfile, refetch } = useQuery(USER_PROFILE, {
    //         variables: { id: userId },
    //         polling: 500,
    //         onCompleted: (data) => {
    //             if (username === data.user.username) {
    //                 setTitle('Typenpost - My profile')
    //                 setIsMyProfile(true)
    //             } else {
    //                 setTitle('Typenpost - ' + data.user.username)
    //                 setIsMyProfile(false)
    //             }
    //             const amIFollowing = data.user.profile.amIFollowing
    //             if (amIFollowing === 'no') {
    //                 setIsFollowing(false)
    //             } else if (amIFollowing === 'yes') {
    //                 setIsFollowing(true)
    //             }
    //             const newTitle = ((username === data.user.username) ? 
    //             'Typenpost - My profile' : 
    //             'Typenpost - ' + data.user.username)
    //             setTitle(newTitle)
    //         }
    // })

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
    //     handleFollow({variables: {username: userData.user.username}})
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
    // },[userData])

    // if (
    //     errorUserProfile ||
    //     errorFollowingUser) {
    //     return <Error />
    // }
    // if (userData && userData.user === null) {
    //     return <Error description='User is not found.' />
    // }
    return (
        // !isImageOpen ?
        // <>
        // <h1 className='text-center mb-3'>
        //     {isMyProfile ? 'My Profile' : 'User Profile' }
        // </h1>
        // <Card style={{padding: '10px'}}>
        // <Row>
        //     <Col md='auto' xs={12} className='text-center'>
        //         <ProgressiveImage 
        //           src={userData && userData.user.profile.avatar ? 
        //             userData.user.profile.avatar : nobody} 
        //           placeholder={userData && userData.user.profile.avatar ? 
        //             createImagePlaceholderUrl(
        //                 userData.user.profile.avatar, '16x16') : nobody}
        //         >
        //           {(src, loading) => 
        //             <img 
        //               style={{filter: loading && 'blur(8px}', 
        //                 'WebkitFilter': loading && 'blur(8px)'}} 
        //               height='250' 
        //               width='250' 
        //               className="rounded-circle" 
        //               onClick={handleImageClick}
        //               src={src}
        //               alt="mdo" />}
        //         </ProgressiveImage>
        //     </Col>
        //     <Col md xs={12}>
        //         <Row>
        //             <Col xs>
        //                 {(loadingUserProfile || userData.user.firstName || 
        //                     userData.user.lastName) && 
        //                 <Placeholder as='h2' animation='glow' 
        //                     className='mb-0'>
        //                     {loadingUserProfile ? 
        //                     <>
        //                         <Placeholder xs={2} bg='secondary'/>{' '}
        //                         <Placeholder xs={4} bg='secondary'/>
        //                     </> : 
        //                     userData.user.firstName + ' ' + 
        //                     userData.user.lastName}
        //                 </Placeholder>}
        //                 <Placeholder as='p' animation='glow' 
        //                     className='text-muted mt-0 mb-1'>
        //                     {loadingUserProfile ? 
        //                     <Placeholder xs={3} bg='secondary'/> :
        //                     '@' + userData.user.username}
        //                 </Placeholder>
        //             </Col>
        //             {isAuthenticated &&
        //             <Col xs='auto'>
        //                 {isMyProfile ? 
        //                 <Button 
        //                     variant='outline-dark'
        //                     as={Link}
        //                     to='/profile/edit'
        //                     state={userData}>Edit profile
        //                 </Button> : 
        //                 <>
        //                 {isFollowing ? 
        //                 <button 
        //                     className='fixed-btn-size following-btn btn'
        //                     onClick={handleFollowButton}
        //                     onMouseOver={handleChangeFollowingBtnText}
        //                     onMouseLeave={handleChangeFollowingBtnText}
        //                     >
        //                     {loadingFollowingUser ? 
        //                         <div><Spinner
        //                             as='span'
        //                             animation='border'
        //                             size='sm'
        //                             role='status'
        //                             aria-hidden='true' />
        //                         <span className='visually-hidden'>
        //                             Loading...</span>
        //                         </div> : 
        //                         followingBtnText
        //                     }
        //                 </button> :
        //                 <Button
        //                     className='fixed-btn-size'
        //                     variant='primary'
        //                     onClick={handleFollowButton}>
        //                     {loadingFollowingUser ? 
        //                         <div><Spinner
        //                             as='span'
        //                             animation='border'
        //                             size='sm'
        //                             role='status'
        //                             aria-hidden='true' />
        //                         <span className='visually-hidden'>
        //                             Loading...</span>
        //                         </div> : 
        //                         'Follow'
        //                     }
        //                 </Button>}
        //                 </>
        //                 }
        //             </Col>}
        //         </Row>
        //         <p>
        //             <Placeholder as='b' animation='glow'>
        //                 {loadingUserProfile ? 
        //                 <Placeholder xs={1} bg='secondary'/> :
        //                 userData.user.profile.numberOfFollowing}
        //             </Placeholder>
        //             <span className='text-muted'> Following &nbsp;</span>
        //             <Placeholder as='b' animation='glow'>
        //                 {loadingUserProfile ? 
        //                 <Placeholder xs={1} bg='secondary'/>:
        //                 userData.user.profile.numberOfFollowers}
        //             </Placeholder>
        //             <span className='text-muted'> Followers</span>
        //         </p>
        //         {(loadingUserProfile || userData.user.profile.about) && 
        //         <Placeholder as='p' className='mb-2' animation='glow'>
        //             {loadingUserProfile ? 
        //             <>
        //             <Placeholder xs={3} bg='secondary'/>{' '}
        //             <Placeholder xs={5} bg='secondary'/>{' '} 
        //             <Placeholder xs={2} bg='secondary'/>{' '}
        //             <Placeholder xs={6} bg='secondary'/>{' '} 
        //             <Placeholder xs={3} bg='secondary'/>{' '}
        //             <Placeholder xs={5} bg='secondary'/>
        //             </> :
        //             userData.user.profile.about}
        //         </Placeholder>}
                
        //         {isMyProfile && 
        //             <>
        //             <div className='mb-2'>
        //             <a
        //             onClick={() => setShowMore(prev => !prev)}
        //             style={{'cursor': 'pointer'}}>
        //             <div className='centered-label'>
        //             {!showMore ? <>More info&nbsp;<BsChevronDown/></> : 
        //             <>Less info&nbsp;<BsChevronUp/></>} 
        //             </div>
        //             </a>
        //             </div>
        //             {showMore ? 
        //             <>
        //             <p className='mb-1 text-muted'>
        //                 Joined: {format(parseISO(userData.user.dateJoined), 
        //                     'MMMM d, yyyy')}
        //             </p>
        //             <p className='mb-1 text-muted'>
        //                 Email: {userData.user.email}
        //             </p>
        //             {userData && userData.user.secondaryEmail &&
        //             <p animation='glow' className='mb-1 text-muted'>
        //                 Secondary Email: {userData.user.secondaryEmail}
        //             </p>}
        //             </>: <></>
        //             }
        //             </>
        //         }
        //     </Col>
        // </Row>
        // </Card>
        // </> :
        // <Lightbox
        //     mainSrc={userData.user.profile.avatar ? 
        //             userData.user.profile.avatar : nobody}
        //     onCloseRequest={() => setIsImageOpen(false)} 
        // />
        <h1>Following</h1>
    )
}
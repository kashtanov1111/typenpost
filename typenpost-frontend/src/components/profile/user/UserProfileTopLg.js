import React, { useState } from "react";
import ProgressiveImage from 'react-progressive-graceful-image'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import Placeholder from 'react-bootstrap/Placeholder'
import { useNavigate } from "react-router-dom";
import gear from '../../../assets/images/gear.svg'

export function UserProfileTopLg({
    setIsImageOpen,
    loadingUserProfile,
    isMyProfile,
    amIFollowing,
    isHeFollowing,
    improvedUserData,
    userUsername,
    placeholderProfileSrc,
    avatarSrc,
    getDateJoined,
    getFinalStringForNumber,
    loadingFollowingUser,
    handleFollow,
    email,
    secondaryEmail,
    isAuthenticated
}) {
    const navigate = useNavigate()
    const [showMore, setShowMore] = useState(false)

    return (
        <section className='user-header-lg'>
            <div className="user-header__avatar">
                <ProgressiveImage
                    src={avatarSrc}
                    placeholder={placeholderProfileSrc}
                >
                    {(src, loading) =>
                        <img
                            style={{
                                filter: loading && 'blur(1px}',
                                'WebkitFilter': loading && 'blur(1px)'
                            }}
                            className="pointer img-shadowed"
                            onClick={() => setIsImageOpen(true)}
                            width='72'
                            height='72'
                            src={src}
                            alt="mdo" />}
                </ProgressiveImage>
            </div>
            <div className='user-header-lg__top-right'>
                <div className='user-header-lg-top-right__first-line'>
                    <div className="user-header__username">
                        <p>{'@' + userUsername}</p>
                    </div>
                {isAuthenticated && improvedUserData && <>
                    {isMyProfile ?
                        <>
                            <Button
                                className='user-header-lg__edit-button'
                                onClick={() => {
                                    navigate('../edit_profile',
                                        { replace: true, state: (improvedUserData && improvedUserData) });
                                }}
                                variant='outline-dark'>Edit Profile</Button>
                        </>
                        :
                        <>
                            {amIFollowing ?
                                <Button
                                    className='user-header-lg__edit-button'
                                    variant='following'
                                    onClick={handleFollow}
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
                                    className='user-header-lg__edit-button'
                                    variant='primary'
                                    onClick={handleFollow}>
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
                                        (isHeFollowing ? 'Follow back' : 'Follow')
                                    }
                                </Button>
                            }
                        </>
                    }</>}
                </div>
                <div className='user-header-stats'>
                    <div className="user-header__posts">
                        <Placeholder as='p' animation='glow' className="user-header__num">
                            {loadingUserProfile ?
                                <Placeholder xs={5} bg='secondary' /> :
                                improvedUserData && getFinalStringForNumber(
                                    improvedUserData.numberOfPosts)}
                        </Placeholder>
                        <p className='user-header__posts-word'>Posts</p>
                    </div>
                    <div onClick={() => navigate('followers')} className="user-header__followers">
                        <Placeholder as='p' animation='glow' className="user-header__num">
                            {loadingUserProfile ?
                                <Placeholder xs={5} bg='secondary' /> :
                                improvedUserData && getFinalStringForNumber(
                                    improvedUserData.numberOfFollowers)}
                        </Placeholder>
                        <p className='user-header__followers-word'>Followers</p>
                    </div>
                    <div onClick={() => navigate('following')} className="user-header__following">
                        <Placeholder as='p' animation='glow' className="user-header__num">
                            {loadingUserProfile ?
                                <Placeholder xs={5} bg='secondary' /> :
                                improvedUserData && getFinalStringForNumber(
                                    improvedUserData.numberOfFollowing)}
                        </Placeholder>
                        <p className='user-header__following-word'>Following</p>
                    </div>
                </div>
            </div>
            <div className="user-header__name">
                <Placeholder as='h4' animation='glow'
                >
                    {loadingUserProfile ?
                        <>
                            <Placeholder xs={2} bg='secondary' />{' '}
                            <Placeholder xs={4} bg='secondary' />
                        </> :
                        improvedUserData && improvedUserData.name}
                </Placeholder>
            </div>
            <div className="user-header__about">
                <Placeholder as='p' animation='glow'>
                    {loadingUserProfile ?
                        <>
                            <Placeholder xs={3} bg='secondary' />{' '}
                            <Placeholder xs={5} bg='secondary' />{' '}
                            <Placeholder xs={2} bg='secondary' />{' '}
                            <Placeholder xs={6} bg='secondary' />{' '}
                            <Placeholder xs={3} bg='secondary' />{' '}
                            <Placeholder xs={5} bg='secondary' />
                        </> :
                        improvedUserData && improvedUserData.about}
                </Placeholder>
            </div>
            <div className="user-header__date-joined text-muted">
                <Placeholder as='p' animation='glow'>
                    Joined:{' '}
                    {loadingUserProfile ?
                        <Placeholder xs={5} bg='secondary' /> :
                        getDateJoined(improvedUserData && improvedUserData.dateJoined)}
                </Placeholder>
            </div>
            <div className={"user-header__emails text-muted" + (!isMyProfile ? ' offscreen' : '')}>
                <p className={(!showMore ? '' : 'offscreen') + ' pointer mb-1'} onClick={() => setShowMore(true)}>More...</p>
                <div className={showMore ? '' : 'offscreen'}>
                    <p className={secondaryEmail ? '' : 'mb-1'}>
                        Email: {email}
                    </p>
                    <p className={secondaryEmail ? 'mb-2' : 'offscreen'}>
                        Secondary Email: {secondaryEmail}
                    </p>
                </div>
            </div>
        </section>
    )
}
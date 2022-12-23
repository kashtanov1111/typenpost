import { createImageSrcUrl } from "../../../functions/functions";
import { getDateJoined } from "../../../functions/functions";
import { IsAuthContext } from "../../../context/LoginContext";
import { useFollowing } from "../../../customHooks/useFollowing";
import { useNavigate } from "react-router-dom";
import { UserProfileTopLg } from "./UserProfileTopLg";
import Button from 'react-bootstrap/Button'
import gear from '../../../assets/images/gear.svg'
import gear_white from '../../../assets/images/gear-white.svg'
import Placeholder from 'react-bootstrap/Placeholder'
import ProgressiveImage from 'react-progressive-graceful-image'
import React, { useState, useContext } from "react";

export function UserProfileTop({
    amIFollowing,
    avatarSrc,
    email,
    getFinalStringForNumber,
    handleAlert,
    improvedUserData,
    isHeFollowing,
    isMyProfile,
    loadingUserProfile,
    placeholderProfileSrc,
    secondaryEmail,
    setIsImageOpen,
    setShowSettingsModal,
    showSettingsModal,
    userUsername,
}) {
    // console.log('User Profile Top Render')

    const navigate = useNavigate()
    const isAuthenticated = useContext(IsAuthContext)
    const [showMore, setShowMore] = useState(false)

    const following = useFollowing(
        userUsername,
        amIFollowing,
        improvedUserData,
        handleAlert)
    const handleFollow = following.handleFollow

    return (<>
        <UserProfileTopLg
            amIFollowing={amIFollowing}
            avatarSrc={avatarSrc}
            email={email}
            getDateJoined={getDateJoined}
            getFinalStringForNumber={getFinalStringForNumber}
            handleFollow={handleFollow}
            improvedUserData={improvedUserData}
            isAuthenticated={isAuthenticated}
            isHeFollowing={isHeFollowing}
            isMyProfile={isMyProfile}
            loadingUserProfile={loadingUserProfile}
            placeholderProfileSrc={placeholderProfileSrc}
            secondaryEmail={secondaryEmail}
            setIsImageOpen={setIsImageOpen}
            userUsername={userUsername}
        />
        <section className='user-header'>
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
            <div className="user-header__username">
                <p>{'@' + userUsername}</p>
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
            <div className={"user-header__date-joined text-muted" + (!isMyProfile ? ' mb-1' : '')}>
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
            {isAuthenticated && improvedUserData &&
                <div className='user-header__buttons'>
                    {isMyProfile ?
                        <>
                            <Button
                                onClick={() => {
                                    navigate('../edit_profile',
                                        { replace: true, state: (improvedUserData && improvedUserData) });
                                }}
                                variant='outline-dark'>Edit Profile</Button>
                            <Button
                                onClick={() => setShowSettingsModal(true)}
                                variant='outline-dark'
                                className='settings-btn'>
                                <img className={showSettingsModal ? 'offscreen' : ''} src={createImageSrcUrl(gear)} alt="" width='15' height='15' />
                                <img className={showSettingsModal ? '' : 'offscreen'} src={createImageSrcUrl(gear_white)} alt="" width='15' height='15' />
                                <span>Settings</span>
                            </Button>
                        </>
                        :
                        <>
                            {amIFollowing ?
                                <Button
                                    variant='following'
                                    className="longer-btn"
                                    onClick={handleFollow}
                                >
                                    <span>Following</span>
                                </Button> :
                                <Button
                                    className="longer-btn"
                                    variant='primary'
                                    onClick={handleFollow}>
                                    {(
                                        isHeFollowing !== null &&
                                        isHeFollowing) ? 'Follow back' : 'Follow'}
                                </Button>
                            }
                        </>
                    }
                </div>}
        </section>
    </>
    )
}
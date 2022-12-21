import { AlertContext } from '../../../context/AlertContext';
import { createImagePlaceholderUrl } from '../../../functions/functions';
import { Error } from "../../Error";
import { getFinalStringForNumber } from '../../../functions/functions';
import { HeaderLogoutModal } from '../../header/HeaderLogoutModal';
import { HeaderSettingsModal } from '../../header/HeaderSettingsModal';
import { PostCard } from '../../post/card/PostCard';
import { SpinnerForPages } from '../../SpinnerForPages';
import { useParams, useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { USER_PROFILE } from "../../../gqls/queries";
import { UsernameContext, IsAuthContext } from '../../../context/LoginContext';
import { UserProfileTop } from './UserProfileTop';
import InfiniteScroll from 'react-infinite-scroll-component'
import nobody from '../../../assets/images/nobody.jpg'
import ProgressiveImage from 'react-progressive-graceful-image';
import React, { useState, useEffect, useContext } from "react";
import Spinner from 'react-bootstrap/Spinner';
import white from '../../../assets/images/white.png'


export function UserProfile({ secondaryEmail, email, handleLogout }) {
    console.log('User Profile render')

    const handleAlert = useContext(AlertContext)
    const username = useContext(UsernameContext)
    const isAuthenticated = useContext(IsAuthContext)
    const location = useLocation()
    const pathname = location.pathname
    const params = useParams()
    const userUsername = params.userUsername

    const [isMyProfile, setIsMyProfile] = useState(null)
    const [amIFollowing, setAmIFollowing] = useState(null)
    const [isHeFollowing, setIsHeFollowing] = useState(null)
    const [isImageOpen, setIsImageOpen] = useState(false)
    const [showSettingsModal, setShowSettingsModal] = useState(false)
    const [showLogoutModal, setShowLogoutModal] = useState(false)

    var improvedUserData = null
    var userPosts = null
    var placeholderProfileSrc = null
    var avatarSrc = null

    if (isAuthenticated === true) {
        if (username) {
            if (username === userUsername && isMyProfile !== true) {
                setIsMyProfile(true)
            }
            if (username !== userUsername && isMyProfile !== false) {
                setIsMyProfile(false)
            }
        }
    } else if (isAuthenticated === false && isMyProfile !== false) {
        setIsMyProfile(false)
    }

    const { data, fetchMore, loading: loadingUserProfile, error } = useQuery(USER_PROFILE, {
        variables: { username: userUsername },
        onCompleted: (data) => {
            const amIFollowing = data.user.profile.amIFollowing
            if (amIFollowing) {
                setAmIFollowing(true)
            } else {
                setAmIFollowing(false)
            }
            const isHeFollowing = data.user.profile.isHeFollowing
            if (isHeFollowing) {
                setIsHeFollowing(true)
            } else {
                setIsHeFollowing(false)
            }
        },
    })

    useEffect(() => {
        if (isMyProfile === false) {
            document.title = 'Typenpost - ' + userUsername
        } else if (isMyProfile === true) {
            document.title = 'Typenpost - My Profile'
        }
    }, [userUsername, isMyProfile])

    if (data && data.user) {
        const user = data.user
        if (user === null) {
            return <Error description='User is not found.' />
        } else {
            improvedUserData = {
                id: user.profile.id,
                name: user.name,
                dateJoined: user.dateJoined,
                email: user.email,
                secondaryEmail: user.secondaryEmail,
                avatar: user.profile.avatar,
                about: user.profile.about,
                numberOfFollowers: user.profile.numberOfFollowers,
                numberOfFollowing: user.profile.numberOfFollowing,
                numberOfPosts: user.numberOfPosts,
            }
            userPosts = user.posts

        }
    }
    if (improvedUserData === null) {
        placeholderProfileSrc = white
        avatarSrc = white
    } else {
        if (improvedUserData.avatar === null) {
            placeholderProfileSrc = nobody
            avatarSrc = nobody
        } else {
            placeholderProfileSrc = createImagePlaceholderUrl(
                improvedUserData.avatar, '250x250')
            avatarSrc = improvedUserData.avatar
        }
    }

    function handleLogoutButtonClicked() {
        setShowLogoutModal(false)
        handleLogout()
        handleAlert('You have signed out.', 'success')
    }

    if (error) {
        return <Error />
    }

    return (
        !isImageOpen ?
            <>
                <HeaderSettingsModal
                    pathname={pathname}
                    secondaryEmail={secondaryEmail}
                    showSettingsModal={showSettingsModal}
                    setShowSettingsModal={setShowSettingsModal}
                    setShowLogoutModal={setShowLogoutModal}
                />
                <HeaderLogoutModal
                    handleLogoutButtonClicked={handleLogoutButtonClicked}
                    showLogoutModal={showLogoutModal}
                    setShowLogoutModal={setShowLogoutModal}
                />
                <UserProfileTop
                    setIsImageOpen={setIsImageOpen}
                    loadingUserProfile={loadingUserProfile}
                    isMyProfile={isMyProfile}
                    amIFollowing={amIFollowing}
                    isHeFollowing={isHeFollowing}
                    improvedUserData={improvedUserData}
                    userUsername={userUsername}
                    placeholderProfileSrc={placeholderProfileSrc}
                    avatarSrc={avatarSrc}
                    handleAlert={handleAlert}
                    setShowSettingsModal={setShowSettingsModal}
                    email={email}
                    secondaryEmail={secondaryEmail}
                    showSettingsModal={showSettingsModal}
                    getFinalStringForNumber={getFinalStringForNumber}
                />
                <InfiniteScroll
                    dataLength={data ? userPosts.edges.length : 1}
                    next={() => fetchMore({
                        variables: {
                            username: userUsername,
                            cursor: userPosts.pageInfo.endCursor,
                        },
                    })}
                    hasMore={data && userPosts.pageInfo.hasNextPage}
                    loader={<div className='text-center my-3'>
                        <Spinner variant='primary' animation='border' />
                    </div>}
                    style={{ overflow: 'visible' }}
                >
                    {data ? userPosts.edges.map((el) => (
                        el.node &&
                        <PostCard
                            key={el.node.id}
                            post={el.node}
                            placeholderProfileSrc={placeholderProfileSrc}
                            avatarSrc={avatarSrc}
                            improvedUserData={improvedUserData}
                            userUsername={userUsername}
                            authUsername={username}
                            handleAlert={handleAlert}
                            getFinalStringForNumber={getFinalStringForNumber}
                        />
                    )) : <SpinnerForPages />}
                </InfiniteScroll>
            </>
            :
            <div className='avatar-opened' onClick={() => setIsImageOpen(false)}>
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
                            onClick={(e) => e.stopPropagation()}
                            src={src}
                            alt="mdo" />}
                </ProgressiveImage>
            </div>
    )
}
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
import { USER_PROFILE_TOP, USER_PROFILE_POSTS } from "../../../gqls/queries";
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

    window.history.replaceState({}, document.title)
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
    var placeholderProfileSrc = null
    var avatarSrc = null
    var userPosts = null

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

    const {
        data: dataTop,
        loading: loadingUserProfileTop,
        error: errorUserProfileTop } = useQuery(
            USER_PROFILE_TOP, {
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

    const {
        data: dataPosts,
        fetchMore,
        error: errorUserProfilePosts,
        refetch } = useQuery(USER_PROFILE_POSTS, {
            variables: { username: userUsername }
        })

    useEffect(() => {
        if (isMyProfile === false) {
            document.title = 'Typenpost - ' + userUsername
        } else if (isMyProfile === true) {
            document.title = 'Typenpost - My Profile'
        }
    }, [userUsername, isMyProfile])

    useEffect(() => {
        if (location.state === 'created') {
            refetch()
        }
    }, [location.state, refetch])

    if (dataTop && dataTop.user && dataPosts && dataPosts.user) {
        const user = dataTop.user
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
            userPosts = dataPosts.user.posts
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

    if (errorUserProfileTop || errorUserProfilePosts) {
        return <Error />
    }

    return (
        !isImageOpen ?
            <>
                <HeaderSettingsModal
                    pathname={pathname}
                    secondaryEmail={secondaryEmail}
                    setShowLogoutModal={setShowLogoutModal}
                    setShowSettingsModal={setShowSettingsModal}
                    showSettingsModal={showSettingsModal}
                />
                <HeaderLogoutModal
                    handleLogoutButtonClicked={handleLogoutButtonClicked}
                    setShowLogoutModal={setShowLogoutModal}
                    showLogoutModal={showLogoutModal}
                />
                <UserProfileTop
                    amIFollowing={amIFollowing}
                    avatarSrc={avatarSrc}
                    email={email}
                    getFinalStringForNumber={getFinalStringForNumber}
                    handleAlert={handleAlert}
                    improvedUserData={improvedUserData}
                    isHeFollowing={isHeFollowing}
                    isMyProfile={isMyProfile}
                    loadingUserProfile={loadingUserProfileTop}
                    placeholderProfileSrc={placeholderProfileSrc}
                    secondaryEmail={secondaryEmail}
                    setIsImageOpen={setIsImageOpen}
                    setShowSettingsModal={setShowSettingsModal}
                    showSettingsModal={showSettingsModal}
                    userUsername={userUsername}
                />
                <InfiniteScroll
                    dataLength={(dataPosts && userPosts) ? userPosts.edges.length : 1}
                    next={() => fetchMore({
                        variables: {
                            username: userUsername,
                            cursor: (userPosts.pageInfo.endCursor),
                        },
                    })}
                    hasMore={(dataPosts && userPosts) && userPosts.pageInfo.hasNextPage}
                    loader={<div className='text-center my-3'>
                        <Spinner variant='primary' animation='border' />
                    </div>}
                    style={{ overflow: 'visible' }}
                >
                    {(dataPosts && userPosts) ? userPosts.edges.map((el) => (
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
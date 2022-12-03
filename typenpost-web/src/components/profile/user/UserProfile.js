import React, { useState, useEffect, useContext } from "react";
import nobody from '../../../assets/images/nobody.jpg'
import { useTitle } from "../../../customHooks/hooks";
import { Link, useParams, useNavigate } from "react-router-dom";
import { USER_PROFILE } from "../../../gqls/queries";
import { FOLLOWING_USER } from '../../../gqls/mutations';
import { Error } from "../../Error";
import { useMutation, useLazyQuery, useQuery } from "@apollo/client";
import Lightbox from 'react-image-lightbox'
import { UserProfileTop } from './UserProfileTop';
// import { PostCard } from '../../post/card/PostCard';
import Button from "react-bootstrap/Button";
import {
    UsernameContext,
    IsAuthContext
} from '../../../context/LoginContext';

export function UserProfile(props) {
    console.log('User Profile render')

    const username = useContext(UsernameContext)
    const isAuthenticated = useContext(IsAuthContext)
    const params = useParams()
    const userUsername = params.userUsername
    // const navigate = useNavigate()

    const [isMyProfile, setIsMyProfile] = useState(null)
    const [amIFollowing, setAmIFollowing] = useState(null)
    const [isHeFollowing, setIsHeFollowing] = useState(null)
    const [isImageOpen, setIsImageOpen] = useState(false)
    // const yearNow = new Date().getFullYear()

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
        data,
        loading: loadingUserProfile,
        error: errorUserProfile, refetch } = useQuery(USER_PROFILE, {
            variables: { username: userUsername },
            onCompleted: (data) => {
                console.log('insideOnCompleted')
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

    // const firstName = data && data.user && data.user.firstName
    // const lastName = data && data.user && data.user.lastName
    // const dateJoined = data && data.user && data.user.dateJoined
    // const email = data && data.user && data.user.email
    // const secondaryEmail = data && data.user && data.user.secondaryEmail
    // const avatar = data && data.user && data.user.profile.avatar
    // const about = data && data.user && data.user.profile.about
    // const numberOfFollowers = data && data.user && data.user.profile.numberOfFollowers
    // const numberOfFollowing = data && data.user && data.user.profile.numberOfFollowing
    // const amIFollowing = data && data.user && data.user.profile.amIFollowing
    // const isHeFollowing = data && data.user && data.user.profile.isHeFollowing



    const [handleFollow, {
        loading: loadingFollowingUser,
        error: errorFollowingUser }] = useMutation(FOLLOWING_USER, {
            variables: { username: userUsername },
            onCompleted: (data) => {
                console.log(data)
                if (data.followingUser.success === true) {
                    refetch({ username: userUsername })
                }
            }
        })

    // useEffect(() => {
    //     queryUser()
    // },[queryUser])
    useEffect(() => {
        if (isMyProfile === false) {
            document.title = 'Typenpost - ' + userUsername
        } else if (isMyProfile === true) {
            document.title = 'Typenpost - My Profile'
        }
    }, [userUsername, isMyProfile])

    function handleImageClick() {
        setIsImageOpen(true)
    }
    if (
        errorUserProfile ||
        errorFollowingUser) {
        return <Error />
    }
    if (data && data.user === null) {
        return <Error description='User is not found.' />
    }
    return (
        // !isImageOpen ?
        <>
            <h1>{userUsername}</h1>
            <p>Followers {data && data.user.profile.numberOfFollowers}</p>
            <p>Following {data && data.user.profile.numberOfFollowing}</p>
            <button onClick={handleFollow}>following button</button>
            <Button
                as={Link}
                to='/profile/1kashtanov'
                variant='outline-dark'
                className="me-2">
                1kashtanov
            </Button>
            <Button
                as={Link}
                to='/profile/0'
                variant='outline-dark'
                className="me-2">
                0 user
            </Button>
            <Button
                as={Link}
                to='/profile/1'
                variant='outline-dark'
                className="me-2">
                1 user
            </Button>
            {/* <div className='marginx-8px'>
                <UserProfileTop
                    data={data}
                    handleImageClick={handleImageClick}
                    loadingUserProfile={loadingUserProfile}
                    isAuthenticated={isAuthenticated}
                    isMyProfile={isMyProfile}
                    amIFollowing={amIFollowing}
                    loadingFollowingUser={loadingFollowingUser}
                    isHeFollowing={isHeFollowing}
                    handleFollow={handleFollow}
                /> */}
            {/* {data && data.user.posts.edges.map((el) => (
         el.node && 
         <PostCard
             key={el.node.id}
             node={el.node}
             data={data}
             loadingUserProfile={loadingUserProfile}
             yearNow={yearNow}
             isMyProfile={isMyProfile}
         />
     ))} */}
            {/* </div> */}

        </>
        // :
        // <Lightbox
        //     mainSrc={data.user.profile.avatar ?
        //         data.user.profile.avatar : nobody}
        //     onCloseRequest={() => setIsImageOpen(false)}
        // />
    )
}
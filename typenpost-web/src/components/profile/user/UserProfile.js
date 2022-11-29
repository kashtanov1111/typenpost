import nobody from '../../../assets/images/nobody.jpg'
import React, {useState, useEffect} from "react";
import { useTitle } from "../../../functions/functions";
import { useParams, useNavigate } from "react-router-dom";
import { USER_PROFILE } from "../../../gqls/queries";
import { FOLLOWING_USER } from '../../../gqls/mutations';
import { Error } from "../../Error";
import { useMutation, useQuery } from "@apollo/client";
import Lightbox from 'react-image-lightbox'
import { UserProfileTop } from './UserProfileTop';
import { PostCard } from '../../post/card/PostCard';

import { experimental_useEvent as useEvent } from 'react';

export function UserProfile(props) {
    const {isAuthenticated, username} = props
    const params = useParams()
    const userUsername = params.userUsername
    const navigate = useNavigate()
    
    const [title, setTitle] = useState('Typenpost')
    const [isMyProfile, setIsMyProfile] = useState('initial')
    const [amIFollowing, setAmIFollowing] = useState('initial')
    const [isHeFollowing, setIsHeFollowing] = useState('initial')
    const [isImageOpen, setIsImageOpen] = useState(false)
    const yearNow = new Date().getFullYear()
    

    useTitle(title)

    const { 
        data: userData, 
        loading: loadingUserProfile, 
        error: errorUserProfile, refetch } = useQuery(USER_PROFILE, {
            variables: { username: userUsername },
            // polling: 500,
            notifyOnNetworkStatusChange: true,
            onCompleted: (data) => {
                console.log('insideOnCompleted')
                if (username === data.user.username) {
                    console.log('username=datausername')
                    setTitle('Typenpost - My profile')
                    setIsMyProfile(true)
                } else {
                    console.log('username!=datausername')
                    setTitle('Typenpost - ' + data.user.username)
                    setIsMyProfile(false)
                }
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
                const newTitle = ((username === data.user.username) ? 
                'Typenpost - My profile' : 
                'Typenpost - ' + data.user.username)
                setTitle(newTitle)
            },
    })

    const [handleFollow, {
        loading: loadingFollowingUser, 
        error: errorFollowingUser}] = useMutation(FOLLOWING_USER, {
        onCompleted: (data) => {
            if (data.followingUser.success === true) {
                refetch({username: userUsername})
            }
        }
    })

    
    function handleImageClick() {
        setIsImageOpen(true)
    }
    
    useEffect( () => {
        refetch({username: userUsername})
        console.log('insideUseEffect')
    },[navigate, isAuthenticated])

    if (
        errorUserProfile ||
        errorFollowingUser) {
        return <Error />
    }
    if (userData && userData.user === null) {
        return <Error description='User is not found.' />
    }
    return (
        <>{!isImageOpen ?
        <div className='marginx-8px'>
        <UserProfileTop
            userData={userData}
            handleImageClick={handleImageClick}
            loadingUserProfile={loadingUserProfile}
            isAuthenticated={isAuthenticated}
            isMyProfile={isMyProfile}
            amIFollowing={amIFollowing}
            loadingFollowingUser={loadingFollowingUser}
            isHeFollowing={isHeFollowing}
            handleFollow={handleFollow}
        />
        {userData && userData.user.posts.edges.map((el) => (
            el.node && 
            <PostCard
                key={el.node.id}
                node={el.node}
                userData={userData}
                loadingUserProfile={loadingUserProfile}
                yearNow={yearNow}
                isMyProfile={isMyProfile}
            />
        ))}
        </div> :
        <Lightbox
            mainSrc={userData.user.profile.avatar ? 
                    userData.user.profile.avatar : nobody}
            onCloseRequest={() => setIsImageOpen(false)} 
        />}
        </>
    )
}

import { AlertContext } from '../../context/AlertContext';
import { Error } from '../Error';
import { getFinalStringForNumber } from '../../functions/functions';
import { POST_DETAIL } from '../../gqls/queries';
import { PostCard } from './card/PostCard';
import { useLazyQuery } from '@apollo/client';
import { useParams, useLocation } from 'react-router-dom';
import { UsernameContext } from '../../context/LoginContext';
import { useScrollTop } from '../../customHooks/useScrollTop';
import React, { useState, useContext, useEffect } from 'react'
import { createImagePlaceholderUrl } from '../../functions/functions';
import nobody from '../../assets/images/nobody.jpg'
import { SpinnerForPages } from '../SpinnerForPages';

export function PostDetail() {
    console.log('Post Detail render')
    
    const handleAlert = useContext(AlertContext)
    const authUsername = useContext(UsernameContext)
    const location = useLocation()
    const params = useParams()
    const postUUID = params.postId
    const [post, setPost] = useState({})
    var hasPrevPage = null
    if (location.state) {
        hasPrevPage = location.state.from
    }
    useScrollTop()

    const [getPostDetail, {
        error: errorPostDetail }] = useLazyQuery(
            POST_DETAIL,
            {
                variables: { uuid: postUUID },
                onCompleted: (data) => {
                    console.log('lazy query')
                    if (data.post) {
                        const dataPost = data.post
                        const dataAvatar = dataPost.user.profile.avatar
                        setPost({
                            created: dataPost.created,
                            text: dataPost.text,
                            id: dataPost.id,
                            uuid: dataPost.uuid,
                            numberOfLikes: dataPost.numberOfLikes,
                            hasILiked: dataPost.hasILiked,
                            name: dataPost.user.name,
                            username: dataPost.user.username,
                            avatar: (dataAvatar ?
                                dataAvatar : nobody),
                            placeholder: (dataAvatar ?
                                createImagePlaceholderUrl(dataAvatar, '50x50') :
                                nobody),
                        })
                    }
                }
            }
        )

    useEffect(() => {
        if (location.state === null) {
            getPostDetail()
        } else {
            setPost(location.state.completedPost)
        }
    }, [location.state, getPostDetail])

    if (errorPostDetail) {
        return <Error />
    }

    return (
        (Object.keys(post).length !== 0) ?
            <PostCard
                post={post}
                handleAlert={handleAlert}
                fromPostDetail={true}
                hasPrevPage={hasPrevPage}
                getFinalStringForNumber={getFinalStringForNumber}
                authUsername={authUsername} /> :
            <SpinnerForPages />
    )
}
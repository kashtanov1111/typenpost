import { AlertContext } from '../../context/AlertContext';
import { Error } from '../Error';
import { getFinalStringForNumber } from '../../functions/functions';
import { POST_DETAIL, POST_COMMENTS } from '../../gqls/queries';
import { PostCard } from './card/PostCard';
import { useLazyQuery, useQuery } from '@apollo/client';
import { useParams, useLocation } from 'react-router-dom';
import { UsernameContext } from '../../context/LoginContext';
import { useScrollTop } from '../../customHooks/useScrollTop';
import React, { useState, useContext, useEffect, useRef } from 'react'
import { createImagePlaceholderUrl } from '../../functions/functions';
import nobody from '../../assets/images/nobody.jpg'
import { SpinnerForPages } from '../SpinnerForPages';
import { PostComments } from './PostComments';
import { CommentCreate } from './CommentCreate';

export function PostDetail() {
    console.log('Post Detail render')

    window.history.replaceState({}, document.title)

    const handleAlert = useContext(AlertContext)
    const authUsername = useContext(UsernameContext)
    const location = useLocation()
    const params = useParams()
    const postUUID = params.postId
    const [autoFocusShow, setAutoFocusShow] = useState(false)

    const [post, setPost] = useState({})

    function handleLikeClickForPostDetail() {
        setPost({
            ...post,
            numberOfLikes: post.numberOfLikes + (post.hasILiked ? -1 : 1),
            hasILiked: !post.hasILiked
        })
    }

    function handleShowAutoFocus() {
        console.log('show')
        setAutoFocusShow(true)
    }

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
                    // console.log('lazy query')
                    if (data.post) {
                        const dataPost = data.post
                        const dataAvatar = dataPost.user.profile.avatar
                        setPost({
                            created: dataPost.created,
                            text: dataPost.text,
                            id: dataPost.id,
                            uuid: dataPost.uuid,
                            numberOfLikes: dataPost.numberOfLikes,
                            numberOfComments: dataPost.numberOfComments,
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

    const [getPostComments, {
        data: postComments,
        fetchMore,
        refetch
    }] = useLazyQuery(POST_COMMENTS, {
        variables: { uuid: postUUID },
        onError: () => {
            handleAlert('An error occured, please try again.', 'danger')
        }
    })

    useEffect(() => {
        if (location.state === null || location.state === 'loggedIn') {
            getPostDetail()
            getPostComments()
        } else {
            const completedPost = location.state.completedPost
            setPost(completedPost)
            if (completedPost.numberOfComments !== 0) {
                getPostComments()
            }
        }
    }, [location.state, getPostDetail, getPostComments])

    useEffect(() => {
        if (location.state && location.state.autoFocusShow === true) {
            setAutoFocusShow(true)
        }
    }, [location.state])
    
    if (errorPostDetail) {
        return <Error />
    }

    return (
        <>
            {(Object.keys(post).length !== 0) ?
                <PostCard
                    post={post}
                    handleAlert={handleAlert}
                    fromPostDetail={true}
                    hasPrevPage={hasPrevPage}
                    getFinalStringForNumber={getFinalStringForNumber}
                    handleLikeClickForPostDetail={location.state && handleLikeClickForPostDetail}
                    handleShowAutoFocus={handleShowAutoFocus}
                    authUsername={authUsername} /> :
                <SpinnerForPages />}
            <div className='divider-post-detail'></div>
            {authUsername && <CommentCreate
                autoFocusShow={autoFocusShow}
                setAutoFocusShow={setAutoFocusShow}
                handleAlert={handleAlert}
                postUUID={postUUID}
                refetch={refetch}
                setPost={setPost}
                post={post} 
                notMobile={true}
                />}
            <div className='post-comments'>
                <PostComments
                    fetchMore={fetchMore}
                    postUUID={postUUID}
                    postId={post.id}
                    authUsername={authUsername}
                    handleAlert={handleAlert}
                    data={postComments} />
            </div>
            {authUsername && <CommentCreate
                autoFocusShow={autoFocusShow}
                setAutoFocusShow={setAutoFocusShow}
                handleAlert={handleAlert}
                postUUID={postUUID}
                refetch={refetch}
                setPost={setPost}
                post={post} />}
        </>
    )
}
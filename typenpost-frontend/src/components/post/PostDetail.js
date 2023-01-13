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
import { gql } from '@apollo/client';
import { useApolloClient } from '@apollo/client';
import { PostComments } from './PostComments';
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import { CREATE_COMMENT } from '../../gqls/mutations';
import { useMutation } from '@apollo/client';

export function PostDetail() {
    console.log('Post Detail render')

    window.history.replaceState({}, document.title)

    const client = useApolloClient()
    const handleAlert = useContext(AlertContext)
    const authUsername = useContext(UsernameContext)
    const location = useLocation()
    const params = useParams()
    const postUUID = params.postId
    const textAreaRef = useRef(null)

    const [post, setPost] = useState({})
    const [newComment, setNewComment] = useState('')
    const formForNewCommentDisabled = (newComment === '' || newComment.length > 2000)

    function handleLikeClickForPostDetail() {
        const editedPost = client.readFragment({
            id: 'PostNode:' + post.id,
            fragment: gql`
                    fragment Post on PostNode {
                        numberOfLikes
                        hasILiked
                    }
                `
        })
        setPost({
            ...post,
            numberOfLikes: editedPost.numberOfLikes,
            hasILiked: editedPost.hasILiked
        })
    }

    async function handleCreateNewComment() {
        if (!formForNewCommentDisabled) {
            setNewComment('')
            await createComment()
            const editedPost = client.readFragment({
                id: 'PostNode:' + post.id,
                fragment: gql`
                        fragment Post on PostNode {
                            numberOfComments
                        }
                    `
            })
            setPost({
                ...post,
                numberOfComments: editedPost.numberOfComments,
            })
            refetch()
        }
    }
    
    var hasPrevPage = null
    var autoFocusShow = false
    if (location.state) {
        hasPrevPage = location.state.from
        autoFocusShow = location.state.autoFocusShow
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

    const [createComment] = useMutation(CREATE_COMMENT, {
        variables: {
            text: newComment,
            postUuid: postUUID
        },
        optimisticResponse: {
            createComment: {
                comment: {
                    id: 'temp-id',
                    uuid: 'temp-uuid',
                    __typename: 'CommentNode',
                    text: newComment,
                    created: new Date(),
                    numberOfLikes: 0,
                    hasILiked: false,
                }
            }
        },
        update(cache) {
            cache.modify({
                id: 'PostNode:' + post.id,
                fields: {
                    numberOfComments(cachedValue) {
                        return cachedValue + 1
                    }
                }
            })
        },
        onError: (error) => {
            console.log(error)
            handleAlert('An error occured, please try again.', 'danger')
        },
    })


    const {
        data: postComments,
        fetchMore,
        refetch
    } = useQuery(POST_COMMENTS, {
        variables: { uuid: postUUID },
        onError: () => {
            handleAlert('An error occured, please try again.', 'danger')
        }
    })

    useEffect(() => {
        if (location.state === null) {
            getPostDetail()
        } else {
            setPost(location.state.completedPost)
        }
    }, [location.state, getPostDetail])

    useEffect(() => {
        if (textAreaRef) {
            textAreaRef.current.style.height = "0px";
            const scrollHeight = textAreaRef.current.scrollHeight;
            textAreaRef.current.style.height = scrollHeight + "px";
        }
    }, [textAreaRef, newComment]);

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
                    authUsername={authUsername} /> :
                <SpinnerForPages />}
            <div className='post-comments'>
                <PostComments
                    fetchMore={fetchMore}
                    postUUID={postUUID}
                    authUsername={authUsername}
                    handleAlert={handleAlert}
                    data={postComments} />
            </div>
            <div className='comment-form-mobile'>
                <InputGroup>
                    <Form.Control
                        ref={textAreaRef}
                        className='shadow-none'
                        style={{borderRadius: '0.25rem', width: '100vw'}}
                        placeholder='Add a comment'
                        autoFocus={autoFocusShow}
                        value={newComment}
                        onChange={(e) => {
                            setNewComment(e.target.value)
                        }}
                        as="textarea"
                        aria-label="With textarea" />
                    <p 
                        className={'pointer comment-form-mobile__post-button ' +
                        (formForNewCommentDisabled ? 'comment-form-mobile__post-button--disabled' : '')}
                        onClick={handleCreateNewComment}
                        >
                        Post
                    </p>
                </InputGroup>
            </div>
        </>
    )
}
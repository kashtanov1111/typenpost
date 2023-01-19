import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import { useState, useEffect, useRef } from 'react'
import { useMutation } from '@apollo/client'
import {
    CREATE_COMMENT,
    CREATE_REPLY_TO_COMMENT
} from '../../gqls/mutations'
import { handleTextOnCreation } from '../../functions/functions'
import { useOutsideAlerter } from '../../customHooks/useOtsideAlerter'

export function CommentCreate({
    autoFocusShow,
    handleAlert,
    handleReplyOnCommentCreation,
    postUUID,
    refetchPostComments,
    setPost,
    post,
    notMobile,
    setAutoFocusShow,
    setCommentUUID,
    setCommentUserUsername,
    commentUUID,
    commentUserUsername
}) {
    const textAreaRef = useRef(null)
    const [newComment, setNewComment] = useState('')
    const formForNewCommentDisabled = (newComment === '' || newComment.length > 2000)

    if (autoFocusShow === true) {
        textAreaRef.current.children[0].focus()
    }

    const [createComment] = useMutation(CREATE_COMMENT, {
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
        onError: () => {
            handleAlert('An error occured, please try again.', 'danger')
        },
    })

    const [createReplyToComment] = useMutation(CREATE_REPLY_TO_COMMENT, {
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
        onError: () => {
            handleAlert('An error occured, please try again.', 'danger')
        },
    })


    useEffect(() => {
        if (textAreaRef) {
            textAreaRef.current.children[0].style.height = "0px";
            const scrollHeight = textAreaRef.current.children[0].scrollHeight;
            textAreaRef.current.children[0].style.height = scrollHeight + "px";
        }
    }, [textAreaRef, newComment]);

    useEffect(() => {
        if ((commentUUID !== null) && (commentUserUsername !== null)) {
            setNewComment('@' + commentUserUsername + ' ')
        } else {
            setNewComment('')
        }
    }, [commentUUID, setNewComment, commentUserUsername])

    useOutsideAlerter(textAreaRef, () => {
        setAutoFocusShow(false)
        setCommentUUID(null)
        setCommentUserUsername(null)
    })
    
    function handleCreateNewComment() {
        if (!formForNewCommentDisabled) {
            if ((commentUUID !== null) && (commentUserUsername !== null)) {
                createReplyToComment({
                    variables: {
                        text: handleTextOnCreation(newComment),
                        commentUuid: commentUUID
                    },
                })
                handleReplyOnCommentCreation()
            } else {
                createComment({
                    variables: {
                        text: handleTextOnCreation(newComment),
                        postUuid: postUUID
                    },
                })
                refetchPostComments()
            }
            setPost({
                ...post,
                numberOfComments: post.numberOfComments + 1,
            })
            setNewComment('')
        }
    }

    return (
        <div className={notMobile === true ? 'comment-form-small' : 'comment-form'}>
            <InputGroup ref={textAreaRef}>
                <Form.Control
                    className='shadow-none'
                    style={{ width: '100%', borderRadius: '0.25rem' }}
                    placeholder='Add a comment'
                    autoFocus={autoFocusShow}
                    value={newComment}
                    onChange={(e) => {
                        setNewComment(e.target.value)
                    }}
                    as="textarea"
                    aria-label="With textarea" />
                <p
                    className={'pointer comment-form__post-button ' +
                        (formForNewCommentDisabled ? 'comment-form__post-button--disabled' : '')}
                    onClick={handleCreateNewComment}
                >
                    Post
                </p>
            </InputGroup>
        </div>
    )
}
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import { useState, useEffect, useRef } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_COMMENT } from '../../gqls/mutations'
import { handleTextOnCreation } from '../../functions/functions'
import { useOutsideAlerter } from '../../customHooks/useOtsideAlerter'

export function CommentCreate({
    autoFocusShow,
    handleAlert,
    postUUID,
    refetch,
    setPost,
    post,
    notMobile,
    setAutoFocusShow
}) {
    const textAreaRef = useRef(null)
    const [newComment, setNewComment] = useState('')
    const formForNewCommentDisabled = (newComment === '' || newComment.length > 2000)

    if (autoFocusShow === true) {
        textAreaRef.current.focus()
    }

    useOutsideAlerter(textAreaRef, () => setAutoFocusShow(false))
    
    const [createComment] = useMutation(CREATE_COMMENT, {
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


    useEffect(() => {
        if (textAreaRef) {
            textAreaRef.current.style.height = "0px";
            const scrollHeight = textAreaRef.current.scrollHeight;
            textAreaRef.current.style.height = scrollHeight + "px";
        }
    }, [textAreaRef, newComment]);


    function handleCreateNewComment() {
        if (!formForNewCommentDisabled) {
            createComment({
                variables: {
                    text: handleTextOnCreation(newComment),
                    postUuid: postUUID
                },
            })
            setNewComment('')
            setPost({
                ...post,
                numberOfComments: post.numberOfComments + 1,
            })
            refetch()
        }
    }

    return (
        <div className={notMobile === true ? 'comment-form-small' : 'comment-form'}>
            <InputGroup>
                <Form.Control
                    ref={textAreaRef}
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
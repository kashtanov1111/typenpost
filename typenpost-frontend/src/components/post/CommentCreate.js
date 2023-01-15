import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import { useState, useEffect, useRef } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_COMMENT } from '../../gqls/mutations'

export function CommentCreate({
    autoFocusShow,
    handleAlert,
    postUUID,
    refetch,
    setPost,
    post
}) {
    const textAreaRef = useRef(null)
    const [newComment, setNewComment] = useState('')
    const formForNewCommentDisabled = (newComment === '' || newComment.length > 2000)

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
 
    
    useEffect(() => {
        if (textAreaRef) {
            textAreaRef.current.style.height = "0px";
            const scrollHeight = textAreaRef.current.scrollHeight;
            textAreaRef.current.style.height = scrollHeight + "px";
        }
    }, [textAreaRef, newComment]);

    
    function handleCreateNewComment() {
        if (!formForNewCommentDisabled) {
            setNewComment('')
            createComment()
            setPost({
                ...post,
                numberOfComments: post.numberOfComments + 1,
            })
            refetch()
        }
    }
    
    return (
        <div className='comment-form-mobile'>
            <InputGroup>
                <Form.Control
                    ref={textAreaRef}
                    className='shadow-none'
                    style={{ borderRadius: '0.25rem', width: '100vw' }}
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
    )
}
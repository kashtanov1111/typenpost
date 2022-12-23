import React, { useState, useEffect, useContext } from "react";
import { IsAuthContext, UsernameContext, IdContext } from "../../context/LoginContext";
import { useNavigate } from "react-router-dom";
import { CREATE_POST } from "../../gqls/mutations";
import { useMutation } from "@apollo/client";
import { AlertContext } from "../../context/AlertContext";
import send_btn from '../../assets/images/send-btn.svg'
import arrow from '../../assets/images/white-arrow.svg'
import { createImageSrcUrl } from "../../functions/functions";

export function PostCreate() {

    console.log('Post Create render')

    const navigate = useNavigate()
    const [post, setPost] = useState('')
    const handleAlert = useContext(AlertContext)
    const authUserId = useContext(IdContext)
    const isAuthenticated = useContext(IsAuthContext)
    const authUsername = useContext(UsernameContext)

    // console.log(handleCreatePostButtonClicked())

    const [createPost] = useMutation(CREATE_POST, {
        variables: {
            text: post
        },
        optimisticResponse: {
            createPost: {
                post: {
                    id: 'temp-id',
                    uuid: 'temp-uuid',
                    __typename: 'PostNode',
                    text: post,
                    created: new Date(),
                    numberOfLikes: 0,
                    hasILiked: false,
                }
            }
        },
        update(cache) {
            cache.modify({
                id: 'UserNode:' + authUserId,
                fields: {
                    numberOfPosts(cachedValue) {
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
        if (isAuthenticated === false) {
            navigate('../login', { replace: true, state: '/create' })
        }
    }, [isAuthenticated, navigate])

    function handleCreatePostButtonClicked() {
        navigate('../profile/' + authUsername, {state: 'created'})
        handleAlert('The post was successfully created.', 'success')
        createPost()
    }

    return (
        <>
            <h1 onClick={() => window.scrollTo(0, 0)} className='logo-banner'>
                <img
                    className='logo-banner-back'
                    onClick={(e) => {
                        e.stopPropagation()
                        navigate(-1)
                    }}
                    src={createImageSrcUrl(arrow)}
                    alt="" width='40' height='40' />
                {post.length !== 0 && <img
                    onClick={handleCreatePostButtonClicked}
                    className='logo-banner-send pointer'
                    src={createImageSrcUrl(send_btn)}
                    alt="" width='30' height='30' />}
                <span className='name'>typenpost</span>
            </h1>
            <form className='create-post-form'>
                <textarea
                    className='create-post-form__textarea'
                    autoFocus={true}
                    value={post}
                    onChange={(e) => {
                        setPost(e.target.value)
                    }}
                    cols="30" rows="10"></textarea>
            </form>
        </>
    )
}
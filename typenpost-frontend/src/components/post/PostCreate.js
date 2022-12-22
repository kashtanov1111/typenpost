import React, { useState, useEffect, useContext } from "react";
import send_btn from '../../assets/images/send-btn.svg'
import { IsAuthContext, UsernameContext } from "../../context/LoginContext";
import { useNavigate } from "react-router-dom";
import { CREATE_POST } from "../../gqls/mutations";
import { useMutation } from "@apollo/client";
import { AlertContext } from "../../context/AlertContext";

export function PostCreate() {
    const navigate = useNavigate()
    const [post, setPost] = useState('')
    const handleAlert = useContext(AlertContext)
    const isAuthenticated = useContext(IsAuthContext)
    const authUsername = useContext(UsernameContext)

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
        onCompleted: (data) => {
            navigate('../profile/' + authUsername, {state: data.createPost.post})
            handleAlert('The post was successfully created.', 'success')
        }
    })

    useEffect(() => {
        if (isAuthenticated === false) {
            navigate('../login', { replace: true, state: '/create' })
        }
    }, [isAuthenticated, navigate])
    
    return (
        <>
            <form className='create-post-form'>
                <textarea
                    className='create-post-form__textarea'
                    autoFocus={true}
                    value={post}
                    onChange={(e) => {
                        setPost(e.target.value)
                    }}
                    cols="30" rows="10"></textarea>

                <img
                    onClick={createPost}
                    className='pointer'
                    src={send_btn}
                    alt="" width='30' height='30' />
            </form>
        </>
    )
}
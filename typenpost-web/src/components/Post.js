import React, { useState } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { useTitle } from './App'
import { useParams } from 'react-router-dom'
import { Loader } from './Loader'
import ccc from '../assets/images/ccc.jpg';
import { createSrcUrl } from './App'

const QUERY_POSTS = gql`
    query GetAllPosts {
        posts {
            edges {
                node {
                    id
                    text
                    created
                }
            }
        }
    }
`
const QUERY_POST = gql`
    query GetPostById($id: ID!) {
        post(id: $id) {
            id
            text
            created
        }
    }
`

const CREATE_POST = gql`
    mutation CreatePost($text: String!) {
        createPost(text: $text) {
            post {
                id
                text
                created
            }
        }
    }
`

export function PostDetail() {
    const params = useParams()
    console.log(params.postId)
    const id = params.postId
    useTitle('Typenpost')
    const { data, loading, error } = useQuery(QUERY_POST, {
            variables: { id: id },
            polling: 500,
    })
    if (loading) {
        return <Loader />
    }
    if (error) {
        return <p>Error! {error.message}</p>
    }
    return (
        <React.Fragment>
        <img src={createSrcUrl(ccc)} alt='sdfsd' />
        <p>{data.post.id}</p>
        <p>{data.post.text}</p>
        </React.Fragment>
    )
}

export function PostInfo() {
    useTitle('Typenpost')
    const navigate = useNavigate()
    const { data, loading, error } = useQuery(
        QUERY_POSTS, {
            pollInterval: 500,
        }
    )
    if (loading) {
        return <Loader />
    }
    if (error) {
        return <p>Error! {error.message}</p>
    }
    return data.posts.edges.map((el) => (
        <div key={el.node.id}>
            <a onClick={() => navigate(`/${el.node.id}`)}>
                Post - {el.node.id}: { el.node.text } { el.node.created }
            </a>
        </div>
    ))
}

export function CreatePost() {
    const [text, setText] = useState('')
    const navigate = useNavigate()
    const [createPost, { data, loading, error }] = useMutation(
        CREATE_POST, 
        {
            variables: {
                text: text
            },
            onCompleted: (d) => {
                console.log(d)
                // navigate('/')  
            },
            refetchQueries: [
                'GetAllPosts',
            ],
        }
        )
    if (loading) return 'Submitting...';
    if (error) return `Submission error! ${error.message}`;
    return (
        <div>
            {data && <p>{data.createPost.post.text}</p>}
            <form onSubmit={(e) => {
                e.preventDefault()
                createPost()
                setText('')
                // createPost ({ variables: {
                //     text: text.value
                // }})
                // text.value = ''
                // window.location.reload()
            }}
            style={{ marginTop: '2em', marginBottom: '2em'}}
            >
                <label>Text: </label>
                <input 
                    // ref={(node) => {
                    //     text = node
                    // }}
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value)
                    }}
                    type='text'
                    placeholder='Type and post'
                    style={{ marginRight: '1em'}}
                />
                <button type='submit' style={{ cursor: 'pointer'}}>
                    Add a Post
                </button>
            </form>
        </div>
    )
}
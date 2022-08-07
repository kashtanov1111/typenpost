import React from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'

const QUERY_POSTS = gql`
    query {
        posts {
            id
            text
            created
        }
    }
`

const CREATE_POST = gql`
    mutation createPost($text: String!) {
        createPost(text: $text) {
            id,
            text,
            created
        }
    }
`

export function PostInfo() {
    const { data, loading} = useQuery(
        QUERY_POSTS, {
            pollInterval: 500
        }
    )
    if (loading) {
        return <p>Loading...</p>
    }
    return data.posts.map(({ id, text, created }) => (
        <div key={id}>
            <p>
                Post - {id}: { text } { created }
            </p>
        </div>
    ))
}

export function CreatePost() {
    let text
    const [createPost] = useMutation(CREATE_POST)
    return (
        <div>
            <form onSubmit={(e) => {
                e.preventDefault()
                createPost ({ variables: {
                    text: text.value
                }})
                text.value = ''
                window.location.reload()
            }}
            style={{ marginTop: '2em', marginBottom: '2em'}}
            >
                <label>Text: </label>
                <input 
                    ref={node => {
                        text = node
                    }}
                    style={{ marginRight: '1em'}}
                />
                <button type='submit' style={{ cursor: 'pointer'}}>
                    Add a Post
                </button>
            </form>
        </div>
    )
}
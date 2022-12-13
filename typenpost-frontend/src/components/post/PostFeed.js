import React, { useEffect, useContext } from "react"
import { useQuery } from "@apollo/client"
import { useTitle } from "../../functions/functions"
import { useNavigate } from "react-router-dom"
import { Loader } from "../Loader"

import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { POST_FEED } from "../../gqls/queries"
import { Error } from "../Error"
import { IsAuthContext, UsernameContext } from "../../context/LoginContext"

export function PostFeed() {
    const isAuthenticated = useContext(IsAuthContext)
    const username = useContext(UsernameContext)
    useTitle('Typenpost')
    const navigate = useNavigate()
    const { data, loading, error, refetch } = useQuery(
        POST_FEED, {
            errorPolicy: 'ignore'
        }
    )
    useEffect(() => {
        if (!isAuthenticated) {
            if (!JSON.parse(
                localStorage.getItem('refreshToken'))) {
                    navigate('../login/', {replace: true})
                }
        }
    }, [isAuthenticated])

    useEffect(() => {
        refetch()
    }, [username])

    if (loading) {
        return <Loader />
    }
    if (error) {
        console.log(error.graphQLErrors)
        return <Error />
    }
    return (isAuthenticated ?
        <Row>
            <Col className='text-center mx-auto' >
                <Button className='text-center mx-auto' onClick={() => refetch()}>
                    Load new posts
                </Button>
            </Col>
                {data && data.feed.edges.map((el) => (
                    (el.node && <div key={el.node.id}>
                        <a onClick={() => navigate(`posts/${el.node.id}`)}>
                            Post - {el.node.id}: { el.node.text } { el.node.created } {el.node.user.username}
                        </a>
                    </div>)
                ))}
        </Row> :
        <Loader />
    )
}
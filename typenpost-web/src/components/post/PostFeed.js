import React, { useEffect } from "react"
import { useQuery } from "@apollo/client"
import { useTitle } from "../../functions/functions"
import { useNavigate } from "react-router-dom"
import { Loader } from "../Loader"

import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { POST_FEED } from "../../gqls/queries"
import { Error } from "../Error"

export function PostFeed(props) {
    const {isAuthenticated} = props
    useTitle('Typenpost')
    const navigate = useNavigate()
    const { data, loading, error, refetch } = useQuery(
        POST_FEED
    )
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('../login/', {replace: true})
        }
    }, [isAuthenticated])
    if (loading) {
        return <Loader />
    }
    if (error) {
        return <Error />
    }
    return (
        <Row>
            <Col className='text-center mx-auto' >
                <Button className='text-center mx-auto' onClick={() => refetch()}>
                    Load new posts
                </Button>
            </Col>
                {data.feed.edges.map((el) => (
                    <div key={el.node.id}>
                        <a onClick={() => navigate(`/${el.node.id}`)}>
                            Post - {el.node.id}: { el.node.text } { el.node.created } {el.node.user.username}
                        </a>
                    </div>
                ))}
        </Row>
    )
}
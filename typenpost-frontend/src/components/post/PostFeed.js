import { AlertContext } from '../../context/AlertContext';
import { Error } from "../Error"
import { getFinalStringForNumber } from "../../functions/functions"
import { IsAuthContext, UsernameContext } from "../../context/LoginContext"
import { POST_FEED } from "../../gqls/queries"
import { PostCard } from "./card/PostCard"
import { SpinnerForPages } from "../SpinnerForPages"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@apollo/client"
import { useTitle } from "../../customHooks/useTitle"
import InfiniteScroll from "react-infinite-scroll-component"
import React, { useEffect, useContext } from "react"
import Spinner from "react-bootstrap/Spinner"
import { useScrollTop } from '../../customHooks/useScrollTop';

export function PostFeed() {
    console.log('Post Feed render')
    const isAuthenticated = useContext(IsAuthContext)
    const handleAlert = useContext(AlertContext)
    const username = useContext(UsernameContext)
    const navigate = useNavigate()
    const { data, fetchMore, error } = useQuery(POST_FEED, {
        fetchPolicy: 'cache-and-network',
    })
    
    useTitle('Typenpost')
    useScrollTop()
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('../login', { replace: true })
        }
    }, [isAuthenticated, navigate])

    if (error) {
        return <Error />
    }

    return (
        <>
            <InfiniteScroll
                dataLength={data ? data.feed.edges.length : 1}
                next={() => fetchMore({
                    variables: {
                        cursor: data.feed.pageInfo.endCursor,
                    },
                })}
                hasMore={data && data.feed.pageInfo.hasNextPage}
                loader={<div className='text-center my-3'>
                    <Spinner variant='primary' animation='border' />
                </div>}
                style={{ overflow: 'visible' }}
            >
                {data ? data.feed.edges.map((el) => (
                    el.node &&
                    <PostCard
                        key={el.node.id}
                        post={el.node}
                        handleAlert={handleAlert}
                        authUsername={username}
                        fromPostFeed={true}
                        getFinalStringForNumber={getFinalStringForNumber}
                    />
                )) : <SpinnerForPages />}
            </InfiniteScroll>
        </>
    )
}
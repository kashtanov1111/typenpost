import React, { useEffect, useContext } from "react"
import { useQuery } from "@apollo/client"
import { useTitle } from "../../customHooks/useTitle"
import { useNavigate } from "react-router-dom"
import { LogoBanner } from "../LogoBanner"
import { POST_FEED } from "../../gqls/queries"
import { Error } from "../Error"
import { IsAuthContext, UsernameContext } from "../../context/LoginContext"
import { SpinnerForPages } from "../SpinnerForPages"
import { PostCard } from "./card/PostCard"
import { getFinalStringForNumber } from "../../functions/functions"
import Spinner from "react-bootstrap/Spinner"
import InfiniteScroll from "react-infinite-scroll-component"

export function PostFeed({ handleAlert }) {
    console.log('Post Feed render')
    const isAuthenticated = useContext(IsAuthContext)
    const username = useContext(UsernameContext)
    useTitle('Typenpost')
    const navigate = useNavigate()
    const { data, fetchMore, loading, error } = useQuery(POST_FEED)
    const yearNow = new Date().getFullYear()

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
            <LogoBanner />
            {!loading ?
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
                    {data && data.feed.edges.map((el) => (
                        el.node &&
                        <PostCard
                            key={el.node.id}
                            post={el.node}
                            yearNow={yearNow}
                            handleAlert={handleAlert}
                            authUsername={username}
                            getFinalStringForNumber={getFinalStringForNumber}
                        />
                    ))}
                </InfiniteScroll> :
                <SpinnerForPages />}
        </>
    )
}
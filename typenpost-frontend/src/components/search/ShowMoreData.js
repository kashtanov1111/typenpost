import { useQuery } from '@apollo/client';
import React, { useEffect } from 'react'
import ProgressiveImage from 'react-progressive-graceful-image';
import { Waypoint } from 'react-waypoint'
import { USER_SEARCH } from '../../gqls/queries';
import { createImagePlaceholderUrl } from '../../functions/functions';
import './search.css';
import { Link } from 'react-router-dom';
import { Button, Spinner } from 'react-bootstrap';
import { Error } from '../Error';
import InfiniteScroll from 'react-infinite-scroll-component';

const ShowMoreData = ({ search, showMore, nobody }) => {



    const { data, fetchMore,
        loading,
        error } = useQuery(USER_SEARCH, {
            variables: { search: search },
        })

    useEffect(() => {
        if (error) {
            return <Error />
        }
    }, [error])

    useEffect(() => {
        console.log("this is show more data", loading)
    }, [loading])

    return (
        <div>
            {!!!showMore && (
                <div>
                    <InfiniteScroll
                        dataLength={data ? data.userSearch.edges.length : 1}
                        next={() => fetchMore({
                            variables: {
                                cursor: data.userSearch.pageInfo.endCursor
                            },
                            updateQuery: (prevResult, { fetchMoreResult }) => {
                                if (!fetchMoreResult) return prevResult
                                const newNodes = fetchMoreResult.userSearch.edges
                                const pageInfo = fetchMoreResult.userSearch.pageInfo
                                return {
                                    ...prevResult,
                                    userSearch: {
                                        edges: [...prevResult.userSearch.edges, ...newNodes],
                                        pageInfo
                                    }
                                }
                            }
                        })}
                        hasMore={data?.userSearch?.pageInfo?.hasNextPage}
                        loader={<div className='text-center my-3'>
                            <Spinner variant='primary' animation='border' />
                        </div>}
                        style={{ 'overflowX': 'hidden' }}
                    >
                        {data?.userSearch?.edges?.map((value) => {
                            const { node: { profile: { avatar } }, node: { username } } = value;
                            return (
                                <Link to={`/profile/${username}`} className="link" key={value.node.id}>
                                    <div className="d-flex align-items-center p-4 mt-5 search_data" >
                                        <ProgressiveImage
                                            src={avatar ?
                                                avatar : nobody}
                                            placeholder={avatar ?
                                                createImagePlaceholderUrl(
                                                    avatar, '30x30') : nobody}
                                        >
                                            {(src, loading) =>
                                                <img
                                                    style={{
                                                        filter: loading && 'blur(1px}',
                                                        'WebkitFilter': loading && 'blur(1px)',
                                                        borderRadius: "50%"
                                                    }}
                                                    width='64'
                                                    height='64'
                                                    src={src}
                                                    alt="avatar" />}
                                        </ProgressiveImage>
                                        <p className='userName'>{username}</p>

                                        {/* {(i === data.userSearch.edges.length - 2 && data.userSearch.pageInfo.hasNextPage) && (
                                        <Waypoint onEnter={async () =>
                                            await fetchMore({
                                                variables: {
                                                    cursor: data.userSearch.pageInfo.endCursor
                                                },
                                                updateQuery: (prevResult, { fetchMoreResult }) => {
                                                    if (!fetchMoreResult) return prevResult
                                                    const newNodes = fetchMoreResult.userSearch.edges
                                                    const pageInfo = fetchMoreResult.userSearch.pageInfo
                                                    return {
                                                        ...prevResult,
                                                        userSearch: {
                                                            edges: [...prevResult.userSearch.edges, ...newNodes],
                                                            pageInfo
                                                        }
                                                    }
                                                }
                                            })}
                                        />
                                    )} */}

                                        {loading && <Spinner style={{ position: "relative", left: '50%' }} animation="border" />}
                                    </div>
                                </Link>
                            )
                        })}
                    </InfiniteScroll>
                </div>
            )}
        </div>
    )
}

export default React.memo(ShowMoreData);
import { AlertContext } from "../../context/AlertContext"
import { Error } from "../Error"
import { POST_LIKES_USERS } from "../../gqls/queries"
import { useContext } from "react"
import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@apollo/client"
import {
    UsernameContext,
    IsAuthContext
} from "../../context/LoginContext"
import { useScrollTop } from "../../customHooks/useScrollTop"
import { useTitle } from "../../customHooks/useTitle"
import InfiniteScroll from "react-infinite-scroll-component"
import Spinner from "react-bootstrap/Spinner"
import { SpinnerForPages } from "../SpinnerForPages"
import { UserFollowCard } from "../profile/follow/UserFollowCard"

export function PostLikes() {

    const handleAlert = useContext(AlertContext)
    const username = useContext(UsernameContext)
    const isAuthenticated = useContext(IsAuthContext)
    const navigate = useNavigate()
    const params = useParams()
    const postId = params.postId

    const { data, fetchMore,
        loading: loadingPostLikesUsers,
        error: errorPostLikesUsers} = useQuery(POST_LIKES_USERS, {
            variables: { uuid: postId }
        })

    const users = data && data.postForLikes.likes

    useScrollTop()
    useTitle('Typenpost - Post Likes')

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('../../login', {
                replace: true,
                state: '/' + postId + '/likes'
            })
        }
    }, [isAuthenticated, postId, navigate])

    if (errorPostLikesUsers) {
        return <Error />
    }

    if (loadingPostLikesUsers) {
        return <SpinnerForPages />
    }

    return (
        <div className='no-padding like-list'>
            <InfiniteScroll
                dataLength={data ? users.edges.length : 1}
                next={() => fetchMore({
                    variables: {
                        cursor: users.pageInfo.endCursor,
                    },
                })}
                hasMore={data && users.pageInfo.hasNextPage}
                loader={<div className='text-center my-3'>
                    <Spinner variant='primary' animation='border' />
                </div>}
                style={{ 'overflowX': 'hidden' }}
            >
                {data && users.edges.map((el) => (el.node &&
                    <UserFollowCard
                        key={el.node.id}
                        profile={el.node}
                        username={username}
                        handleAlert={handleAlert}
                        forLikes={true} />
                ))}
            </InfiniteScroll>
        </div>
    )
}
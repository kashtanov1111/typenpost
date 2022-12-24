import { AlertContext } from '../../../context/AlertContext';
import { Error } from "../../Error";
import { IsAuthContext, UsernameContext } from '../../../context/LoginContext';
import { SpinnerForPages } from "../../SpinnerForPages";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { USER_FOLLOWING } from "../../../gqls/queries";
import { UserFollowCard } from "./UserFollowCard"
import { useTitle } from "../../../customHooks/useTitle";
import InfiniteScroll from 'react-infinite-scroll-component'
import React, { useEffect, useContext } from "react";
import Spinner from "react-bootstrap/Spinner";
import { useScrollTop } from '../../../customHooks/useScrollTop';

export function Following() {
    console.log('Render Following Component')
    
    useScrollTop()
    const handleAlert = useContext(AlertContext)
    const username = useContext(UsernameContext)
    const isAuthenticated = useContext(IsAuthContext)
    const params = useParams()
    const userUsername = params.userUsername
    const navigate = useNavigate()
    var message = ''

    useTitle('Typenpost - Following')
    const { data, fetchMore, 
        loading: loadingUserFollowing,
        error: errorUserFollowing } = useQuery(USER_FOLLOWING, {
        variables: { username: userUsername }
    })

    const following = data && data.user.profile.following

    if (following && (following.edges.length === 0)) {
        message = "This user hasn't followed anyone yet."
    }

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('../../login', {
                replace: true,
                state: '/profile/' + userUsername + '/following'
            })
        }
    }, [isAuthenticated, userUsername, navigate])

    if (errorUserFollowing) {
        return <Error />
    }

    if (loadingUserFollowing) {
        return <SpinnerForPages />
    }

    return (<div className='no-padding'>
        {message &&
            <div className='no-follow-yet'>
                <p>{message}</p>
            </div>
        }
        <InfiniteScroll
            dataLength={data ? following.edges.length : 1}
            next={() => fetchMore({
                variables: {
                    username: userUsername,
                    cursor: following.pageInfo.endCursor,
                },
            })}
            hasMore={data && following.pageInfo.hasNextPage}
            loader={<div className='text-center my-3'>
                <Spinner variant='primary' animation='border' />
            </div>}
            style={{ 'overflowX': 'hidden' }}
        >
            {data && following.edges.map((el) => (el.node &&
                <UserFollowCard
                    key={el.node.id}
                    profile={el.node}
                    username={username}
                    handleAlert={handleAlert} />
            ))}
        </InfiniteScroll>
    </div>
    )
}

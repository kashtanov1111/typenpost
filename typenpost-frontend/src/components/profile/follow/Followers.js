import { AlertContext } from '../../../context/AlertContext';
import { Error } from "../../Error";
import { IsAuthContext, UsernameContext } from '../../../context/LoginContext';
import { SpinnerForPages } from "../../SpinnerForPages";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { USER_FOLLOWERS } from "../../../gqls/queries";
import { UserFollowCard } from "./UserFollowCard"
import { useTitle } from "../../../customHooks/useTitle";
import InfiniteScroll from 'react-infinite-scroll-component'
import React, { useEffect, useContext } from "react";
import Spinner from 'react-bootstrap/Spinner'


export function Followers() {
    console.log('Render Followers Component')
    
    const handleAlert = useContext(AlertContext)
    const username = useContext(UsernameContext)
    const isAuthenticated = useContext(IsAuthContext)
    const params = useParams()
    const userUsername = params.userUsername
    const navigate = useNavigate()
    var message = ''

    useTitle('Typenpost - Followers')
    const { data, fetchMore,
        loading: loadingUserFollowers,
        error: errorUserFollowers } = useQuery(USER_FOLLOWERS, {
        variables: { username: userUsername }
    })

    const followers = data && data.user.profile.followers
    
    if (followers && (followers.edges.length === 0)) {
        message = "This user has no followers yet."
    }

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('../../login', {
                replace: true,
                state: '/profile/' + userUsername + '/followers'
            })
        }
    }, [isAuthenticated, userUsername, navigate])

    if (errorUserFollowers) {
        return <Error />
    }

    if (loadingUserFollowers) {
        return <SpinnerForPages />
    }

    return (<div className='no-padding'>
        {message &&
            <div className='no-follow-yet'>
                <p>{message}</p>
            </div>
        }
        <InfiniteScroll
            dataLength={data ? followers.edges.length : 1}
            next={() => fetchMore({
                variables: {
                    username: userUsername,
                    cursor: followers.pageInfo.endCursor,
                },
            })}
            hasMore={data && followers.pageInfo.hasNextPage}
            loader={<div className='text-center my-3'>
                <Spinner variant='primary' animation='border' />
            </div>}
            style={{ 'overflowX': 'hidden' }}
        >
            {data && followers.edges.map((el) => (el.node &&
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

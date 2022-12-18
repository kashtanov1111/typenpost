import React, { useState, useEffect, useContext } from "react";
import { useTitle } from "../../../customHooks/hooks";
import { useParams, useNavigate } from "react-router-dom";
import { USER_FOLLOWERS } from "../../../gqls/queries";
import { FOLLOWING_USER } from "../../../gqls/mutations";
import { Error } from "../../Error";
import { useMutation, useQuery } from "@apollo/client";
import Spinner from 'react-bootstrap/Spinner'
import InfiniteScroll from 'react-infinite-scroll-component'

import { UserFollowCard } from "./UserFollowCard"

import { IsAuthContext } from '../../../context/LoginContext';

export function Followers(props) {
    console.log('Render Followers Component')

    const isAuthenticated = useContext(IsAuthContext)
    const params = useParams()
    const userUsername = params.userUsername
    const navigate = useNavigate()

    useTitle('Typenpost - Followers')
    const {
        data,
        loading: loadingUserFollowers, fetchMore,
        error: errorUserFollowers } = useQuery(USER_FOLLOWERS, {
            variables: { username: userUsername }
        })

    const followers = data && data.user.profile.followers

    const [handleFollow, {
        loading: loadingFollowingUser,
        error: errorFollowingUser }] = useMutation(FOLLOWING_USER)

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('../../login', {
                replace: true,
                state: '/profile/' + userUsername + '/followers'
            })
        }
    }, [isAuthenticated, userUsername, navigate])

    if (errorUserFollowers || errorFollowingUser) {
        console.log(errorUserFollowers)
        return <Error />
    }

    return (<div className='no-padding'>
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
                    handleFollow={handleFollow}
                    loadingFollowingUser={loadingFollowingUser}
                    loadingUserFollowers={loadingUserFollowers} />
            ))}
        </InfiniteScroll>
    </div>
    )
}

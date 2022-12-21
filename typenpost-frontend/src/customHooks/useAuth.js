import { useState, useEffect } from "react"
import { useLazyQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../gqls/queries';
import {
    REFRESH_TOKEN,
    DELETE_REFRESH_TOKEN,
    DELETE_TOKEN
} from '../gqls/mutations';

export function useAuth(client) {
    const [avatar, setAvatar] = useState(null)
    const [email, setEmail] = useState('')
    const [secondaryEmail, setSecondaryEmail] = useState('')
    const [username, setUsername] = useState('')
    const [authenticatedUserId, setAuthenticatedUserId] = useState(null)
    const [
        authenticatedUserProfileId,
        setAuthenticatedUserProfileId] = useState(null)

    const [isAuthenticated, setIsAuthenticated] = useState(null)

    const [deleteToken, { error: errorDeleteToken }] =
        useMutation(DELETE_TOKEN)
    const [deleteRefreshToken, { error: errorDeleteRefreshToken }] =
        useMutation(DELETE_REFRESH_TOKEN)
    const [refreshToken, { error: errorRefreshToken }] =
        useMutation(REFRESH_TOKEN, {
            errorPolicy: 'ignore',
            onCompleted: (data) => {
                //console.log('REFRESH TOKEN completed, data.refreshToken:', data.refreshToken)
                if (data.refreshToken === null) {
                    setIsAuthenticated(false)
                } else {
                    if (isAuthenticated === null) {
                        queryMe()
                    }
                    setIsAuthenticated(true)
                }
            }
        })

    const [queryMe, { error: errorQueryMe }] =
        useLazyQuery(QUERY_ME,
            {
                fetchPolicy: "cache-and-network",
                onCompleted: (data) => {
                    // console.log('QUERY ME completed, data.me:', data.me)
                    const me = data.me
                    if (me !== null) {
                        setUsername(me.username)
                        setEmail(me.email)
                        setAuthenticatedUserId(me.id)
                        setAuthenticatedUserProfileId(me.profile.id)
                        if (me.profile.avatar === null) {
                            setAvatar(false)
                        } else {
                            setAvatar(me.profile.avatar)
                        }
                        if (me.secondaryEmail === null) {
                            setSecondaryEmail(false)
                        } else {
                            setSecondaryEmail(me.secondaryEmail)
                        }
                    }
                }
            }
        )
    useEffect(() => {
        //console.log('The first useEffect')
        refreshToken()
    }, [refreshToken])

    useEffect(() => {
        //console.log('The second useEffect')
        function intervalFunction() {
            //console.log('inside intervalFunction')
            refreshToken()
        }
        const interval = isAuthenticated ?
            setInterval(intervalFunction, 50000) : null
        return () => {
            //console.log('inside second useEffect return')
            if (interval !== null) {
                //console.log('inside second useEffect return and interval is not null')
                clearInterval(interval)
            }
        }
    }, [isAuthenticated, refreshToken, queryMe])
    //console.log('username', username)

    function handleLogout() {
        deleteToken()
        deleteRefreshToken()
        localStorage.removeItem('refreshToken')
        setIsAuthenticated(false)
        setUsername('')
        setAvatar('')
        setEmail('')
        setSecondaryEmail('')
        client.resetStore()
    }

    return {
        authenticatedUserId: authenticatedUserId,
        authenticatedUserProfileId: authenticatedUserProfileId,
        avatar: avatar,
        email: email,
        errorDeleteRefreshToken: errorDeleteRefreshToken,
        errorDeleteToken: errorDeleteToken,
        errorQueryMe: errorQueryMe,
        errorRefreshToken: errorRefreshToken,
        handleLogout: handleLogout,
        isAuthenticated: isAuthenticated,
        queryMe: queryMe,
        secondaryEmail: secondaryEmail,
        setIsAuthenticated: setIsAuthenticated,
        username: username,
    }
}
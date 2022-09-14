import '../styles/App.css';
import React, { useState } from 'react';
import { Header } from './Header';
import { gql, useQuery, useMutation } from '@apollo/client';
import { Error } from './Error';
import { Loader } from './Loader';
import App from "./App"

const QUERY_ME = gql`
    query CheckIfUserIsAuthenticated {
        me {
            id
            username
            profile {
              avatar
            }
        }
    }
`

const REFRESH_TOKEN = gql`
  mutation RefreshToken {
    refreshToken {
      payload
    }
  }
`
const DELETE_TOKEN = gql`
  mutation DeleteTokenCookie {
    deleteTokenCookie {
      deleted
    }
  }
`
const DELETE_REFRESH_TOKEN = gql`
  mutation DeleteRefreshTokenCookie {
    deleteRefreshTokenCookie {
      deleted
    }
  }
`

export function Authorization(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [username, setUsername] = useState('')
    const [avatar, setAvatar] = useState('')
    const [
        deleteToken, 
        {error: errorDeleteToken}] = useMutation(DELETE_TOKEN)
    const [
        deleteRefreshToken, 
        {error: errorDeleteRefreshToken}] = 
        useMutation(DELETE_REFRESH_TOKEN)
    const [
        refreshToken, 
        {error: errorRefreshToken}] = useMutation(REFRESH_TOKEN)
    const refreshTokenExists = JSON.parse(
    localStorage.getItem('refreshToken'))
    const { loading, error: errorQueryMe} = useQuery(QUERY_ME, 
    {
        pollInterval: 500,
        onCompleted: (data) => {
            if (data.me === null) {
            if (refreshTokenExists) {
                refreshToken()
            }
            } 
            else {
                setIsAuthenticated(true)
                setUsername(data.me.username)
                setAvatar(data.me.profile.avatar)
            }
    }
    }
    )
    console.log('username', username)
    console.log('isauth', isAuthenticated)
    if (loading) {
    return (
        <Loader />
    )
    }

    if (
    errorRefreshToken || 
    errorDeleteToken || 
    errorDeleteRefreshToken || 
    errorQueryMe) {
    return (
        <div>
        <Header 
            username={username} 
            handleLogout={handleLogout} 
            avatar={avatar} 
            isAuthenticated={isAuthenticated} />
        <Error />
        </div>
    )
    }
    
    function handleLogout() {
    deleteToken()
    deleteRefreshToken()
    setIsAuthenticated(false)
    localStorage.removeItem('refreshToken')
    }

    return (
        <React.Fragment>
          <App 
            isAuthenticated={isAuthenticated}
            username={username}
            avatar={avatar}
            handleLogout={handleLogout}
          />  
        </React.Fragment>
    )
}
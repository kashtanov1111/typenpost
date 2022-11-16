import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Header } from '../Header';
import { Error } from '../Error';
import { Loader } from '../Loader';
import { App } from "../App"

import { QUERY_ME } from '../../gqls/queries';
import { 
  REFRESH_TOKEN, 
  DELETE_REFRESH_TOKEN, 
  DELETE_TOKEN } from '../../gqls/mutations'; 

export function Authorization() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [avatar, setAvatar] = useState('')
  const [email, setEmail] = useState('')
  const [secondaryEmail, setSecondaryEmail] = useState('')
  const [verified, setVerified] = useState(false)
  const refreshTokenExists = JSON.parse(
    localStorage.getItem('refreshToken'))
  const [deleteToken, {error: errorDeleteToken}] = 
    useMutation(DELETE_TOKEN)
  const [deleteRefreshToken, {error: errorDeleteRefreshToken}] = 
    useMutation(DELETE_REFRESH_TOKEN)
  const [refreshToken, {error: errorRefreshToken}] = 
    useMutation(REFRESH_TOKEN)
  const { loading, error: errorQueryMe} = useQuery(QUERY_ME, 
    {
      pollInterval: 500,
      onCompleted: (data) => {
          const me = data.me
          if (me !== null) {
              setIsAuthenticated(true)
              setUsername(me.username)
              setAvatar(me.profile.avatar)
              setEmail(me.email)
              setVerified(me.verified)
              setSecondaryEmail(me.secondaryEmail)
          }
      }
    }
  )
  useEffect(() => {
    if (refreshTokenExists) {
      refreshToken()
    }
    function intervalFunction() {
      if (refreshTokenExists){
        refreshToken()
      }
    }
    const interval = setInterval(intervalFunction, 50000)
    return () => clearInterval(interval)
  }, [refreshTokenExists])

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
    localStorage.removeItem('refreshToken')
      return (
        <>
        <Header 
            username={username} 
            handleLogout={handleLogout} 
            avatar={avatar} 
            isAuthenticated={isAuthenticated} />
        <Error />
        </>
      )
  }
  
  async function handleLogout() {
    await deleteToken()
    await deleteRefreshToken()
    localStorage.removeItem('refreshToken')
    setIsAuthenticated(false)
  }

  return (
    <App 
      isAuthenticated={isAuthenticated}
      username={username}
      avatar={avatar}
      email={email}
      verified={verified}
      handleLogout={handleLogout}
      setIsAuthenticated={setIsAuthenticated}
      secondaryEmail={secondaryEmail}
    />  
  )
}
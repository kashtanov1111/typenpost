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
  const [id, setId] = useState('')
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
              setId(me.id)
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
        console.log('lllsdf')
      }
    }
    const interval = setInterval(intervalFunction, 55000)
    console.log('uuuu')
    return () => clearInterval(interval)
  }, [refreshTokenExists])
  console.log(refreshTokenExists)

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
      id={id}
      handleLogout={handleLogout}
      setIsAuthenticated={setIsAuthenticated}
    />  
  )
}
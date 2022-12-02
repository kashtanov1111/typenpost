import '../styles/App.css';
import React, { useState, useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Header } from './header/Header';
import { Error } from './Error';
import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert'
import { RoutesComponent } from './Routes';
import { QUERY_ME } from '../gqls/queries';
import {
  REFRESH_TOKEN,
  DELETE_REFRESH_TOKEN,
  DELETE_TOKEN
} from '../gqls/mutations';
import { IsAuthContext, UsernameContext } from '../context/LoginContext'

export function App({ client }) {
  const [showAlert, setShowAlert] = useState(false)
  const [textAlert, setTextAlert] = useState('')
  const [styleAlert, setStyleAlert] = useState('')
  const [avatar, setAvatar] = useState('')
  const [email, setEmail] = useState('')
  const [secondaryEmail, setSecondaryEmail] = useState('')
  const [verified, setVerified] = useState(false)
  const [username, setUsername] = useState('')

  const [isAuthenticated, setIsAuthenticated] = useState(null)

  const [deleteToken, { error: errorDeleteToken }] =
    useMutation(DELETE_TOKEN)
  const [deleteRefreshToken, { error: errorDeleteRefreshToken }] =
    useMutation(DELETE_REFRESH_TOKEN)
  const [refreshToken, { error: errorRefreshToken }] =
    useMutation(REFRESH_TOKEN, {
      errorPolicy: 'ignore',
      onCompleted: (data) => {
        // console.log('REFRESH TOKEN completed, data.refreshToken:', data.refreshToken)
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
        onCompleted: (data) => {
          // console.log('QUERY ME completed, data.me:', data.me)
          const me = data.me
          if (me !== null) {
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
    // console.log('The first useEffect')
    refreshToken()
  },[refreshToken])
  
  useEffect(() => {
    // console.log('The second useEffect')
    function intervalFunction() {
      // console.log('inside intervalFunction')
      refreshToken()
    }
    const interval = isAuthenticated ?
      setInterval(intervalFunction, 50000) : null
    return () => {
      // console.log('inside second useEffect return')
      if (interval !== null) {
        // console.log('inside second useEffect return and interval is not null')
        clearInterval(interval)
      }
    }
  }, [isAuthenticated, refreshToken, queryMe])

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

  function handleLogout() {
    deleteToken()
    deleteRefreshToken()
    localStorage.removeItem('refreshToken')
    setIsAuthenticated(false)
    client.resetStore()
  }

  function handleAlert(text, style) {
    setTextAlert(text)
    setStyleAlert(style)
    setShowAlert(true)
    setTimeout(() => {
      setShowAlert(false)
    }, 5000);
  }

  console.log('Render App Component,', ', isAuthenticated:', isAuthenticated)

  return (
    <IsAuthContext.Provider value={isAuthenticated} >
      <UsernameContext.Provider value={username} >
        <Header
          avatar={avatar}
          handleLogout={handleLogout}
          handleAlert={handleAlert}
          secondaryEmail={secondaryEmail}
        />
        <Container className='px-2'>
          {showAlert ?
            <Alert 
              className='marginx-8px' 
              style={{ 'borderRadius': '0%' }} 
              key={styleAlert} 
              variant={styleAlert}>
              {textAlert}
            </Alert> :
            <></>}
          <RoutesComponent
            handleLogout={handleLogout}
            handleAlert={handleAlert}
            verified={verified}
            setIsAuthenticated={setIsAuthenticated}
            email={email}
            queryMe={queryMe}
            secondaryEmail={secondaryEmail}
          />
        </Container>
      </UsernameContext.Provider>
    </IsAuthContext.Provider>
  )
}

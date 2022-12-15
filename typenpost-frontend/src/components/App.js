import React, { useState, useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Header } from './header/Header';
import { Error } from './Error';
import { RoutesComponent } from './Routes';
import { QUERY_ME } from '../gqls/queries';
import {
  REFRESH_TOKEN,
  DELETE_REFRESH_TOKEN,
  DELETE_TOKEN
} from '../gqls/mutations';
import Container from 'react-bootstrap/Container'
import {
  IsAuthContext,
  UsernameContext,
  IdContext,
  ProfileIdContext
} from '../context/LoginContext'
import { useLocation } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert'
import { Loader } from './Loader';

export function App({ client }) {
  const location = useLocation()
  const pathname = location.pathname
  const [showAlert, setShowAlert] = useState(false)
  const [textAlert, setTextAlert] = useState('')
  const [styleAlert, setStyleAlert] = useState('')
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
  if (
    errorRefreshToken ||
    errorDeleteToken ||
    errorDeleteRefreshToken ||
    errorQueryMe) {
    return (
      <>
        <div className='unauth'>
          <main className='main'>
            <Error />
          </main>
          <Header
            avatar={avatar}
            handleLogout={handleLogout}
            handleAlert={handleAlert}
            secondaryEmail={secondaryEmail}
          />
        </div>
      </>
    )
  }

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

  function handleAlert(text, style) {
    setTextAlert(text)
    setStyleAlert(style)
    setShowAlert(true)
    setTimeout(() => {
      setShowAlert(false)
    }, 5000);
  }

  if (isAuthenticated === null) {
    return (
      <Loader />
    )
  }

  console.log('Render App Component,', ', isAuthenticated:', isAuthenticated)

  return (
    <IsAuthContext.Provider value={isAuthenticated} >
      <UsernameContext.Provider value={username} >
        <IdContext.Provider value={authenticatedUserId} >
          <ProfileIdContext.Provider value={authenticatedUserProfileId} >
            <div className={isAuthenticated === true ? 'auth' : 'unauth'}>
              <main className='main'>
                {showAlert ?
                  <Alert
                    className='marginx-8px'
                    style={{ 'borderRadius': '0%' }}
                    key={styleAlert}
                    variant={styleAlert}>
                    {textAlert}
                  </Alert> :
                  <></>}
                <Container>
                  <RoutesComponent
                    handleLogout={handleLogout}
                    handleAlert={handleAlert}
                    setIsAuthenticated={setIsAuthenticated}
                    email={email}
                    queryMe={queryMe}
                    secondaryEmail={secondaryEmail}
                  />
                </Container>
              </main>
              <Header
                avatar={avatar}
                handleLogout={handleLogout}
                handleAlert={handleAlert}
                secondaryEmail={secondaryEmail}
              />
            </div>
          </ProfileIdContext.Provider>
        </IdContext.Provider>
      </UsernameContext.Provider>
    </IsAuthContext.Provider>
  )
}

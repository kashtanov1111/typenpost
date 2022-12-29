import React, { useState } from 'react';
import { Header } from './header/Header';
import { Error } from './Error';
import { RoutesComponent } from './Routes';
import Container from 'react-bootstrap/Container'
import {
  IsAuthContext,
  UsernameContext,
  IdContext,
  ProfileIdContext
} from '../context/LoginContext'
import Alert from 'react-bootstrap/Alert'
import { Loader } from './Loader';
import { LogoBanner } from './LogoBanner';
import { AlertContext } from '../context/AlertContext';
import { useAuth } from '../customHooks/useAuth';
import { useAlert } from '../customHooks/useAlert';
import { useApolloClient } from '@apollo/client';

export function App() {
  const client = useApolloClient()

  const alert = useAlert()
  const showAlert = alert.showAlert
  const textAlert = alert.textAlert
  const styleAlert = alert.styleAlert
  const handleAlert = alert.handleAlert

  const authentication = useAuth(client)
  const authenticatedUserId = authentication.authenticatedUserId
  const authenticatedUserProfileId = authentication.authenticatedUserProfileId
  const avatar = authentication.avatar
  const email = authentication.email
  const errorDeleteRefreshToken = authentication.errorDeleteRefreshToken
  const errorDeleteToken = authentication.errorDeleteRefreshToken
  const errorQueryMe = authentication.errorQueryMe
  const errorRefreshToken = authentication.errorRefreshToken
  const handleLogout = authentication.handleLogout
  const isAuthenticated = authentication.isAuthenticated
  const queryMe = authentication.queryMe
  const secondaryEmail = authentication.secondaryEmail
  const setIsAuthenticated = authentication.setIsAuthenticated
  const username = authentication.username

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

  if (isAuthenticated === null) {
    return (
      <Loader />
    )
  }

  console.log('Render App Component,', ', isAuthenticated:', isAuthenticated)

  return (
    <AlertContext.Provider value={handleAlert}>
      <IsAuthContext.Provider value={isAuthenticated} >
        <UsernameContext.Provider value={username} >
          <IdContext.Provider value={authenticatedUserId} >
            <ProfileIdContext.Provider value={authenticatedUserProfileId} >
              <div className={isAuthenticated === true ? 'auth' : 'unauth'}>
                <main className='main'>
                  <Container>
                    {showAlert ?
                      <Alert
                        className='main-alert'
                        key={styleAlert}
                        variant={styleAlert}>
                        {textAlert}
                      </Alert> :
                      <></>}
                    <LogoBanner
                      onClick={() => window.scrollTo(0, 0)}
                    />
                    <RoutesComponent
                      handleLogout={handleLogout}
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
    </AlertContext.Provider>
  )
}
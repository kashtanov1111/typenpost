import '../styles/App.css';
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import { CreatePost, PostDetail } from './post/Post';
import { PostFeed } from './post/PostFeed';
import { Header } from './Header';
import { Login } from './auth/Login';
import { Register } from './auth/Register';
import { PasswordChange} from './auth/PasswordChange';
import { UsernameChange } from './auth/UsernameChange';
import { VerifyAccount } from './auth/VerifyAccount';
import { PasswordReset } from './auth/PasswordReset';
import { PasswordResetWithToken } from './auth/PasswordResetWithToken';
import { UserProfile } from './profile/user/UserProfile';
import { EditProfile } from './profile/EditProfile';
import { AddSecondaryEmail } from './auth/AddSecondaryEmail';
import { SwapEmails } from './auth/SwapEmails';
import { RemoveSecondaryEmail } from './auth/RemoveSecondaryEmail';
import { ArchiveAccount } from './auth/ArchiveAccount';
import { Followers } from './profile/Followers';
import { Following } from './profile/Following';
import { FollowHeader } from './profile/FollowHeader';
import { Error } from './Error';

import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert'

export function App(props) {
  const {
    avatar, 
    username, 
    email,
    verified,
    handleLogout, 
    isAuthenticated, 
    setIsAuthenticated,
    secondaryEmail} = props

  const [showAlert, setShowAlert] = useState(false)
  const [textAlert, setTextAlert] = useState('')
  const [styleAlert, setStyleAlert] = useState('')

  const [clickedOutsideNavbar, setClickedOutsideNavbar] = useState(false)

  function handleAlert(text, style) {
    setTextAlert(text)
    setStyleAlert(style)
    setShowAlert(true)
    setTimeout(() => {
      setShowAlert(false)
    }, 5000);
  }
  return (
    <>
    <Header 
      username={username} 
      avatar={avatar} 
      isAuthenticated={isAuthenticated}
      handleLogout={handleLogout}
      clickedOutsideNavbar={clickedOutsideNavbar}
      handleAlert={handleAlert} 
      secondaryEmail={secondaryEmail}
    />
    <Container className='px-2' onClick={() => setClickedOutsideNavbar(current => !current)}>
      {showAlert ? 
      <Alert className='marginx-8px' style={{'borderRadius':'0%'}} key={styleAlert} variant={styleAlert}>
        {textAlert}
      </Alert> : 
      <></>}
      <Routes>
        <Route index element={<PostFeed
          isAuthenticated={isAuthenticated} 
          username={username}
          />} />
        <Route 
          path='/login' 
          element={<Login 
            handleAlert={handleAlert}
            setIsAuthenticated={setIsAuthenticated}
            isAuthenticated={isAuthenticated} />} />
        <Route 
          path='/register' 
          element={<Register 
            handleAlert={handleAlert}
            isAuthenticated={isAuthenticated} />} />
        <Route path='posts/:postId' element={<PostDetail />} />
        <Route 
          path='/activate/:confirmationToken' 
          element={<VerifyAccount 
            verified={verified}
            handleAlert={handleAlert} 
            username={username}
            isAuthenticated={isAuthenticated} />} />
        <Route 
          path='/password-reset/:confirmationToken' 
          element={<PasswordResetWithToken 
            handleAlert={handleAlert} 
            isAuthenticated={isAuthenticated} />} 
        />
        <Route path='/create' element={<CreatePost />} />
        <Route path='/password_reset' element={<PasswordReset 
          isAuthenticated={isAuthenticated} />} />
        <Route 
          path='/password_change' 
          element={<PasswordChange 
            handleAlert={handleAlert} 
            handleLogout={handleLogout}
            isAuthenticated={isAuthenticated} />} />
        <Route 
          path='/username_change' 
          element={<UsernameChange 
            handleAlert={handleAlert} 
            handleLogout={handleLogout}
            isAuthenticated={isAuthenticated} />} />
        <Route path='/profile/:userUsername' element={<UserProfile
        isAuthenticated={isAuthenticated}
        username={username} />} /> 
        <Route 
          path='/profile/:userUsername'
          element={<FollowHeader />}
           >
            <Route 
              path='followers' 
              element={<Followers 
                isAuthenticated={isAuthenticated}
                username={username} />} />
            <Route 
              path='following' 
              element={<Following 
                isAuthenticated={isAuthenticated}
                username={username} />} />
        </Route>
        <Route 
          path='/profile/edit'
          element={<EditProfile 
            isAuthenticated={isAuthenticated}
            handleAlert={handleAlert}
          />} />
        <Route 
          path='/add_email'
          element={<AddSecondaryEmail 
            isAuthenticated={isAuthenticated}
            handleAlert={handleAlert}
            email={email}
          />} />
        <Route 
          path='/swap_emails'
          element={<SwapEmails 
            isAuthenticated={isAuthenticated}
            handleAlert={handleAlert}
            secondaryEmail={secondaryEmail}
          />} />
        <Route 
          path='/remove_secondary_email'
          element={<RemoveSecondaryEmail 
            isAuthenticated={isAuthenticated}
            handleAlert={handleAlert}
            secondaryEmail={secondaryEmail}
          />} />
        <Route 
          path='/archive_account'
          element={<ArchiveAccount 
            isAuthenticated={isAuthenticated}
            handleAlert={handleAlert}
            handleLogout={handleLogout}
          />} />
        <Route 
          path='*'
          element={<Error description="The page doesn't exist." />} />
      </Routes>
    </Container>
    </>
  )
}

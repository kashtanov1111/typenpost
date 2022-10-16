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
import { UserProfile } from './profile/UserProfile';
import { EditProfile } from './profile/EditProfile';
import { AddSecondaryEmail } from './auth/AddSecondaryEmail';
import { SwapEmails } from './auth/SwapEmails';
import { RemoveSecondaryEmail } from './auth/RemoveSecondaryEmail';
import { ArchiveAccount } from './auth/ArchiveAccount';

import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert'

export function App(props) {
  const {
    avatar, 
    username, 
    id,
    email,
    verified,
    handleLogout, 
    isAuthenticated, 
    setIsAuthenticated,
    secondaryEmail} = props

  const [showAlert, setShowAlert] = useState(false)
  const [textAlert, setTextAlert] = useState('')
  const [styleAlert, setStyleAlert] = useState('')

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
      id={id}
      isAuthenticated={isAuthenticated}
      handleLogout={handleLogout}
      handleAlert={handleAlert} 
      secondaryEmail={secondaryEmail}
    />
    <Container>
      {showAlert ? 
      <Alert className='my-1' key={styleAlert} variant={styleAlert}>
        {textAlert}
      </Alert> : 
      <></>}
      <Routes>
        <Route path='/' element={<PostFeed
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
        <Route path='/:postId' element={<PostDetail />} />
        <Route 
          path='/activate/:confirmationToken' 
          element={<VerifyAccount 
            verified={verified}
            handleAlert={handleAlert} 
            id={id}
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
        <Route 
          path='/profile/:userId'
          element={<UserProfile
            isAuthenticated={isAuthenticated}
            username={username} />} />
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
      </Routes>
    </Container>
    </>
  )
}

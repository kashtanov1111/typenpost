import '../styles/App.css';
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import { CreatePost, PostDetail } from './post/Post';
import { PostFeed } from './post/PostFeed';
import { Header } from './Header';
import { Login } from './auth/Login';
import { Register } from './auth/Register';
import { PasswordChange} from './auth/PasswordChange';
import { VerifyAccount } from './auth/VerifyAccount';
import { PasswordReset } from './auth/PasswordReset';
import { PasswordResetWithToken } from './auth/PasswordResetWithToken';
import { UserProfile } from './profile/UserProfile';

import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert'

export function App(props) {
  const {
    avatar, 
    username, 
    id,
    handleLogout, 
    isAuthenticated, 
    setIsAuthenticated} = props

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
    />
    <Container>
      {showAlert ? 
      <Alert className='my-1' key={styleAlert} variant={styleAlert}>
        {textAlert}
      </Alert> : 
      <></>}
      <Routes>
        <Route path='/' element={<PostFeed
          isAuthenticated={isAuthenticated} />} />
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
            handleAlert={handleAlert} 
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
          path='/profile/:userId'
          element={<UserProfile
            isAuthenticated={isAuthenticated}
            username={username} />} />
      </Routes>
    </Container>
    </>
  )
}

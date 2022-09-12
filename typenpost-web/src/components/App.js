import '../styles/App.css';
import { PostInfo, CreatePost, PostDetail } from './Post';
import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Header } from './Header';
import { Login } from './Login';
import { Register } from './Register';
import { 
  VerifyAccount, 
  PasswordReset, 
  PasswordResetWithToken, 
  PasswordChange} from './Account';
import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert'
import { Logout } from './Logout';

export function useTitle(title) {
  useEffect(() => {
    document.title = title
  })
}



function App(props) {
  const {avatar, username, handleLogout, isAuthenticated} = props
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
    <React.Fragment>
    <Header 
      username={username} 
      avatar={avatar} 
      isAuthenticated={isAuthenticated} />
    <Container>
    {showAlert ? 
    <Alert key={styleAlert} variant={styleAlert}>
      {textAlert}
    </Alert> : 
    <></>}
      <Routes>
        <Route path='/' element={<PostInfo />} />
        <Route 
          path='/logout' 
          element={<Logout handleLogout={handleLogout}/>} />
        <Route 
          path='/login' 
          element={<Login handleAlert={handleAlert} />} />
        <Route 
          path='/register' 
          element={<Register handleAlert={handleAlert}/>} />
        <Route path='/:postId' element={<PostDetail />} />
        <Route 
          path='/activate/:confirmationToken' 
          element={<VerifyAccount handleAlert={handleAlert} />} />
        <Route 
          path='/password-reset/:confirmationToken' 
          element={<PasswordResetWithToken handleAlert={handleAlert} />} />
        <Route path='/create' element={<CreatePost />} />
        <Route path='/password_reset' element={<PasswordReset />} />
        <Route 
          path='/password_change' 
          element={<PasswordChange handleAlert={handleAlert} />} />
      </Routes>
    </Container>
    </React.Fragment>
  )
}

export default App;

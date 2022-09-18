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
import { BsChevronDoubleLeft } from 'react-icons/bs';

export function useTitle(title) {
  useEffect(() => {
    document.title = title
  })
}

export function createPlaceholderUrl(path, size) {
  if (path.indexOf('cloudfront.net') > -1) {
    path = path.slice(path.indexOf('cloudfront.net') + 14,)
  }
  const awsDomainOnlyForImages = "https://d1kll7zdtk3qm0.cloudfront.net"
  const first_part_of_path = path.slice(0, path.lastIndexOf('/'))
  const image_name = path.slice(path.lastIndexOf('/'),)
  const url = awsDomainOnlyForImages + first_part_of_path + '/fit-in/' + size + image_name
  return url
}

export function createSrcUrl(path) {
  const awsDomainOnlyForImages = "https://d1kll7zdtk3qm0.cloudfront.net"
  return awsDomainOnlyForImages + path
}


function App(props) {
  const {avatar, username, handleLogout, isAuthenticated} = props
  const [showAlert, setShowAlert] = useState(false)
  const [textAlert, setTextAlert] = useState('')
  const [styleAlert, setStyleAlert] = useState('')

  console.log('avatar', avatar.slice(avatar.indexOf('cloudfront.net') + 14,))
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
    <Alert className='my-1' key={styleAlert} variant={styleAlert}>
      {textAlert}
    </Alert> : 
    <></>}
      <Routes>
        <Route path='/' element={<PostInfo />} />
        <Route 
          path='/logout' 
          element={<Logout 
            handleLogout={handleLogout} 
            handleAlert={handleAlert}
            />} />
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

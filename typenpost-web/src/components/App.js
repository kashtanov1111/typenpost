import '../styles/App.css';
import { PostInfo, CreatePost, PostDetail } from './Post';
import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Login } from './Login';
import { Register } from './Register';
import { gql, useQuery, useMutation } from '@apollo/client';
import { VerifyAccount, PasswordReset, PasswordResetWithToken, PasswordChange} from './Account';
import { Alert } from './Alert';

export function useTitle(title) {
  useEffect(() => {
    document.title = title
  })
}

const QUERY_ME = gql`
    query CheckIfUserIsAuthenticated {
        me {
            id
            username
            profile {
              avatar
            }
        }
    }
`

const REFRESH_TOKEN = gql`
  mutation RefreshToken {
    refreshToken {
      payload
    }
  }
`
const DELETE_TOKEN = gql`
  mutation DeleteTokenCookie {
    deleteTokenCookie {
      deleted
    }
  }
`
const DELETE_REFRESH_TOKEN = gql`
  mutation DeleteRefreshTokenCookie {
    deleteRefreshTokenCookie {
      deleted
    }
  }
`


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const [textAlert, setTextAlert] = useState('')
  const [styleAlert, setStyleAlert] = useState('')
  const [avatar, setAvatar] = useState('')
  const [deleteToken] = useMutation(DELETE_TOKEN)
  const [deleteRefreshToken] = useMutation(DELETE_REFRESH_TOKEN)
  const [refreshToken] = useMutation(
    REFRESH_TOKEN
  )
  const { data, loading} = useQuery(QUERY_ME, 
    {
      pollInterval: 500,
      onCompleted: ({me}) => {
          console.log(1, me)
          if (me === null) {
              console.log('Not authenticated')
              refreshToken()
          } else {
              console.log('Authenticated')
              console.log(me.username)
              setIsAuthenticated(true)
              setUsername(me.username)
              console.log(me.profile.avatar)
              setAvatar(me.profile.avatar)

          }
      }
  }
  )
  if (loading) {
      return <></>
  }
  console.log(isAuthenticated)
  console.log(data)
  function handleLogout() {
    deleteToken()
    deleteRefreshToken()
    setIsAuthenticated(false)
  }

  function handleAlert(text, style) {
    setTextAlert(text)
    setStyleAlert(style)
    setShowAlert(true)
    setTimeout(() => {
      setShowAlert(false)
    }, 5000);
  }
  
  // function handleChangePassword() {
  //   pass
  // }
  console.log('alert', showAlert)
  return (
    <React.Fragment>
    <Navbar username={username} handleLogout={handleLogout} avatar={avatar} isAuthenticated={isAuthenticated} />
    <Alert text={textAlert} style={styleAlert} show={showAlert}/>
    {/* <button onClick={handleAlert}>ooo</button> */}
    <div className='container'>
        <Routes>
          <Route path='/:postId' element={<PostDetail />} />
          <Route path='/' element={<PostInfo />} />
          <Route path='/activate/:confirmationToken' element={<VerifyAccount handleAlert={handleAlert} />} />
          <Route path='/password-reset/:confirmationToken' element={<PasswordResetWithToken handleAlert={handleAlert} />} />
          <Route path='/create' element={<CreatePost />} />
          <Route path='/login' element={<Login handleAlert={handleAlert} />} />
          <Route path='/register' element={<Register />} />
          <Route path='/password_reset' element={<PasswordReset />} />
          <Route path='/password_change' element={<PasswordChange handleAlert={handleAlert} />} />
        </Routes>
    </div>
    </React.Fragment>
  )
}

export default App;

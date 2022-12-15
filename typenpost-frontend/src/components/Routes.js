import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { CreatePost, PostDetail } from './post/Post';
import { Login } from './auth/Login';
import { Register } from './auth/Register';
import { PasswordChange } from './auth/PasswordChange';
import { PasswordReset } from './auth/PasswordReset';
import { UsernameChange } from './auth/UsernameChange';
import { VerifyAccount } from './auth/VerifyAccount';
import { AddSecondaryEmail } from './auth/AddSecondaryEmail';
import { PasswordResetWithToken } from './auth/PasswordResetWithToken';
import { RemoveSecondaryEmail } from './auth/RemoveSecondaryEmail';
import { VerifySecondaryEmail } from './auth/VerifySecondaryEmail';
import { ArchiveAccount } from './auth/ArchiveAccount';
import { SwapEmails } from './auth/SwapEmails';
import { UserProfile } from './profile/user/UserProfile';
// import { EditProfile } from './profile/EditProfile';
// import { Followers } from './profile/Followers';
// import { Following } from './profile/Following';
// import { FollowHeader } from './profile/FollowHeader';
import { Error } from './Error';
import { TestTest } from './TestTest';


export function RoutesComponent({
  handleLogout,
  handleAlert,
  email,
  secondaryEmail,
  setIsAuthenticated,
  queryMe
}) {
  return (
    <Routes>
      {/* <Route index element={<PostFeed />} /> */}
      <Route path='/' element={<TestTest handleLogout={handleLogout} />} />
      <Route
        path='/login'
        element={<Login
          handleAlert={handleAlert}
          setIsAuthenticated={setIsAuthenticated}
          queryMe={queryMe}
        />} />
      <Route
        path='/register'
        element={<Register
          handleAlert={handleAlert} />} />
      <Route path='posts/:postId' element={<PostDetail />} />
      <Route
        path='/activate/:confirmationToken'
        element={<VerifyAccount handleAlert={handleAlert} />} />
      <Route
        path='/activate2email/:confirmationToken'
        element={<VerifySecondaryEmail
          queryMe={queryMe}
          handleAlert={handleAlert} />} />
      <Route
        path='/password-reset/:confirmationToken'
        element={<PasswordResetWithToken
          handleAlert={handleAlert} />}
      />
      <Route path='/create' element={<CreatePost />} />
      <Route path='/password_reset' element={<PasswordReset />} />
      <Route
        path='/password_change'
        element={<PasswordChange
          handleAlert={handleAlert}
          handleLogout={handleLogout} />} />
      <Route
        path='/username_change'
        element={<UsernameChange
          handleAlert={handleAlert}
          handleLogout={handleLogout} />} />
      <Route
        path='/profile/:userUsername'
        element={<UserProfile handleAlert={handleAlert}/>} />
      {/* <Route
        path='/profile/:userUsername'
        element={<FollowHeader />}
      >
        <Route
          path='followers'
          element={<Followers />} />
        <Route
          path='following'
          element={<Following />} />
      </Route> */}
      {/* <Route
        path='/edit_profile'
        element={<EditProfile
          handleAlert={handleAlert}
        />} /> */}
      <Route
        path='/add_email'
        element={<AddSecondaryEmail
          handleAlert={handleAlert}
          email={email}
        />} />
      <Route
        path='/swap_emails'
        element={<SwapEmails
          handleAlert={handleAlert}
          secondaryEmail={secondaryEmail}
        />} />
      <Route
        path='/remove_secondary_email'
        element={<RemoveSecondaryEmail
          queryMe={queryMe}
          handleAlert={handleAlert}
          secondaryEmail={secondaryEmail}
        />} />
      <Route
        path='/archive_account'
        element={<ArchiveAccount
          handleAlert={handleAlert}
          handleLogout={handleLogout}
        />} />
      <Route
        path='*'
        element={<Error description="The page doesn't exist." />} />
    </Routes>
  )
}
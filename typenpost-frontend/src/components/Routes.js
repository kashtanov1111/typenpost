import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { CreatePost } from './post/Post';
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
import { EditProfile } from './profile/EditProfile';
import { Followers } from './profile/follow/Followers';
import { Following } from './profile/follow/Following';
import { FollowHeader } from './profile/follow/FollowHeader';
import { Error } from './Error';
import { PostDetail } from './post/PostDetail';
import { PostFeed } from './post/PostFeed';


export function RoutesComponent({
  handleLogout,
  email,
  secondaryEmail,
  setIsAuthenticated,
  queryMe
}) {
  return (
    <Routes>
      <Route index element={<PostFeed />} />
      <Route
        path='/login'
        element={<Login
          setIsAuthenticated={setIsAuthenticated}
          queryMe={queryMe}
        />} />
      <Route
        path='/register'
        element={<Register />} />
      <Route path='/:postId' element={<PostDetail />} />
      <Route
        path='/activate/:confirmationToken'
        element={<VerifyAccount />} />
      <Route
        path='/activate2email/:confirmationToken'
        element={<VerifySecondaryEmail
          queryMe={queryMe} />} />
      <Route
        path='/password-reset/:confirmationToken'
        element={<PasswordResetWithToken />}
      />
      <Route path='/create' element={<CreatePost />} />
      <Route path='/password_reset' element={<PasswordReset />} />
      <Route
        path='/password_change'
        element={<PasswordChange handleLogout={handleLogout} />} />
      <Route
        path='/username_change'
        element={<UsernameChange handleLogout={handleLogout} />} />
      <Route
        path='/profile/:userUsername'
        element={<UserProfile 
          handleLogout={handleLogout}
          secondaryEmail={secondaryEmail}
          email={email}
          />} />
      <Route
        path='/profile/:userUsername'
        element={<FollowHeader/>}
      >
        <Route
          path='followers'
          element={<Followers />} />
        <Route
          path='following'
          element={<Following />} />
      </Route>
      <Route
        path='/edit_profile'
        element={<EditProfile />} />
      <Route
        path='/add_email'
        element={<AddSecondaryEmail email={email} />} />
      <Route
        path='/swap_emails'
        element={<SwapEmails secondaryEmail={secondaryEmail} />} />
      <Route
        path='/remove_secondary_email'
        element={<RemoveSecondaryEmail
          queryMe={queryMe}
          secondaryEmail={secondaryEmail}
        />} />
      <Route
        path='/archive_account'
        element={<ArchiveAccount handleLogout={handleLogout} />} />
      <Route
        path='*'
        element={<Error description="The page doesn't exist." />} />
    </Routes>
  )
}
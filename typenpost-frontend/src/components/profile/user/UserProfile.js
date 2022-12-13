// import nobody from '../../../assets/images/nobody.jpg'
// import white from '../../../assets/images/white.png'
// import React, { useState, useEffect, useContext } from "react";
// import { Link, useParams } from "react-router-dom";
// import { USER_PROFILE } from "../../../gqls/queries";
// import { Error } from "../../Error";
// import { useQuery } from "@apollo/client";
// import Lightbox from 'react-image-lightbox'
// import { UserProfileTop } from './UserProfileTop';
// // import { PostCard } from '../../post/card/PostCard';
// import Button from "react-bootstrap/Button";
// import {
//     UsernameContext,
//     IsAuthContext
// } from '../../../context/LoginContext';
// import {
//     createImagePlaceholderUrl
// } from '../../../functions/functions';


// export function UserProfile({handleAlert}) {
//     console.log('User Profile render')

//     const username = useContext(UsernameContext)
//     const isAuthenticated = useContext(IsAuthContext)
//     const params = useParams()
//     const userUsername = params.userUsername

//     const [isMyProfile, setIsMyProfile] = useState(null)
//     const [amIFollowing, setAmIFollowing] = useState(null)
//     const [isHeFollowing, setIsHeFollowing] = useState(null)
//     const [isImageOpen, setIsImageOpen] = useState(false)
//     // const yearNow = new Date().getFullYear()
//     var improvedUserData = null
//     var placeholderProfileSrc = null
//     var avatarSrc = null

//     if (isAuthenticated === true) {
//         if (username) {
//             if (username === userUsername && isMyProfile !== true) {
//                 setIsMyProfile(true)
//             }
//             if (username !== userUsername && isMyProfile !== false) {
//                 setIsMyProfile(false)
//             }
//         }
//     } else if (isAuthenticated === false && isMyProfile !== false) {
//         setIsMyProfile(false)
//     }

//     const {data, loading: loadingUserProfile, error } = useQuery(USER_PROFILE, {
//             variables: { username: userUsername },
//             onCompleted: (data) => {
//                 const amIFollowing = data.user.profile.amIFollowing
//                 if (amIFollowing) {
//                     setAmIFollowing(true)
//                 } else {
//                     setAmIFollowing(false)
//                 }
//                 const isHeFollowing = data.user.profile.isHeFollowing
//                 if (isHeFollowing) {
//                     setIsHeFollowing(true)
//                 } else {
//                     setIsHeFollowing(false)
//                 }
//             },
//         })

//     useEffect(() => {
//         if (isMyProfile === false) {
//             document.title = 'Typenpost - ' + userUsername
//         } else if (isMyProfile === true) {
//             document.title = 'Typenpost - My Profile'
//         }
//     }, [userUsername, isMyProfile])

//     if (data && data.user) {
//         const user = data.user
//         if (user === null) {
//             return <Error description='User is not found.' />
//         } else {
//             improvedUserData = {
//                 profileId: user.profile.id,
//                 name: user.name,
//                 dateJoined: user.dateJoined,
//                 email: user.email,
//                 secondaryEmail: user.secondaryEmail,
//                 avatar: user.profile.avatar,
//                 about: user.profile.about,
//                 numberOfFollowers: user.profile.numberOfFollowers,
//                 numberOfFollowing: user.profile.numberOfFollowing,
//             }
//         }
//     }
//     if (improvedUserData === null) {
//         placeholderProfileSrc = white
//         avatarSrc = white
//     } else {
//         if (improvedUserData.avatar === null ) {
//             placeholderProfileSrc = nobody
//             avatarSrc = nobody
//         } else {
//             placeholderProfileSrc = createImagePlaceholderUrl(
//                 improvedUserData.avatar, '250x250')
//             avatarSrc = improvedUserData.avatar
//         }
//     }

//     if (error) {
//         return <Error />
//     }

//     return (
//         !isImageOpen ?
//         <>
//             {/* <Button
//                 as={Link}
//                 to='/profile/1kashtanov'
//                 variant='outline-dark'
//                 className="me-2">
//                 1kashtanov
//             </Button>
//             <Button
//                 as={Link}
//                 to='/profile/0'
//                 variant='outline-dark'
//                 className="me-2">
//                 0 user
//             </Button>
//             <Button
//                 as={Link}
//                 to='/profile/1'
//                 variant='outline-dark'
//                 className="me-2">
//                 1 user
//             </Button> */}
//             <Button
//                 as={Link}
//                 to='/profile/wwwwwwwwwwwwwwwwwwww'
//                 variant='outline-dark'
//                 className="me-2">
//                 www user
//             </Button>
//             <div className='marginx-8px'>
//                 <UserProfileTop
//                     setIsImageOpen={setIsImageOpen}
//                     loadingUserProfile={loadingUserProfile}
//                     isAuthenticated={isAuthenticated}
//                     isMyProfile={isMyProfile}
//                     amIFollowing={amIFollowing}
//                     isHeFollowing={isHeFollowing}
//                     improvedUserData={improvedUserData}
//                     userUsername={userUsername}
//                     placeholderProfileSrc={placeholderProfileSrc}
//                     avatarSrc={avatarSrc}
//                     handleAlert={handleAlert}
//                 />
//             {/* {data && data.user.posts.edges.map((el) => (
//          el.node && 
//          <PostCard
//              key={el.node.id}
//              node={el.node}
//              data={data}
//              loadingUserProfile={loadingUserProfile}
//              yearNow={yearNow}
//              isMyProfile={isMyProfile}
//          />
//      ))} */}
//             </div>

//         </>
//         :
//         <Lightbox
//             mainSrc={improvedUserData.avatar ?
//                 improvedUserData.avatar : nobody}
//             onCloseRequest={() => setIsImageOpen(false)}
//         />
//     )
// }
import { createImagePlaceholderUrl } from '../../../functions/functions'
import { createImageSrcUrl } from '../../../functions/functions'
import { getDateCreatedPostCard } from '../../../functions/functions'
import { PostDeleteModal } from '../PostDeleteModal'
import { useLiking } from '../../../customHooks/useLiking'
import { useNavigate } from 'react-router-dom'
import { useOutsideAlerter } from '../../../customHooks/useOtsideAlerter'
import comment from '../../../assets/images/chat-left.svg'
import ellipsis from '../../../assets/images/three-dots-vertical.svg'
import heart from '../../../assets/images/heart.svg'
import heart_filled from '../../../assets/images/heart-fill.svg'
import nobody from '../../../assets/images/nobody.jpg'
import ProgressiveImage from 'react-progressive-graceful-image'
import React, { useRef, useState } from "react";
import trash from '../../../assets/images/trash-red.svg'

export function PostCard({
    authUsername,
    avatarSrc,
    fromPostDetail,
    fromPostFeed,
    getFinalStringForNumber,
    handleAlert,
    hasPrevPage,
    improvedUserData,
    placeholderProfileSrc,
    post,
    userUsername,
}) {

    // console.log('Post Card Render')
    const navigate = useNavigate()
    const [showDropdown, setShowDropdown] = useState(false)
    const dropRef = useRef(null)

    useOutsideAlerter(dropRef, () => setShowDropdown(false))

    var completedPost = {}
    if (fromPostDetail !== true) {
        completedPost.created = post.created
        completedPost.text = post.text
        completedPost.id = post.id
        completedPost.uuid = post.uuid
        completedPost.numberOfLikes = post.numberOfLikes
        completedPost.hasILiked = post.hasILiked
        if (fromPostFeed === true) {
            completedPost.name = post.user.name
            completedPost.username = post.user.username
            completedPost.avatar = (post.user.profile.avatar ?
                post.user.profile.avatar : nobody)
            completedPost.placeholder = (post.user.profile.avatar ?
                createImagePlaceholderUrl(post.user.profile.avatar, '50x50') :
                nobody)
        } else {
            completedPost.name = improvedUserData.name
            completedPost.username = userUsername
            completedPost.avatar = avatarSrc
            completedPost.placeholder = placeholderProfileSrc
        }
    } else {
        completedPost = post
    }

    const [showPostDeleteModal, setShowPostDeleteModal] = useState(false)
    const isMyPost = completedPost.username === authUsername
    const liking = useLiking(completedPost, handleAlert)
    const handleLikePost = liking.handleLikePost

    function navigateToUserProfile(e) {
        e.stopPropagation()
        if (fromPostFeed || fromPostDetail) {
            navigate('../profile/' + completedPost.username)
        }
    }

    function navigateToPostDetail() {
        navigate('../' + completedPost.uuid, { state: { completedPost: completedPost, from: true } })
    }

    function handlePostText(text) {
        if (fromPostDetail !== true) {
            if (text.length > 500) {
                return text.slice(0, 500) + '...'
            } else {
                return text
            }
        } else {
            return text
        }
    }

    function handleLikeBtnClicked(e) {
        e.stopPropagation()
        if (authUsername) {
            handleLikePost()
        }
    }

    return (
        <>
            <PostDeleteModal
                postId={post.id}
                postUUID={post.uuid}
                showPostDeleteModal={showPostDeleteModal}
                setShowPostDeleteModal={setShowPostDeleteModal}
                handleAlert={handleAlert}
                fromPostDetail={fromPostDetail}
                hasPrevPage={hasPrevPage}
            />
            <div onClick={navigateToPostDetail} className='post-card'>
                <div className='post-card__top'>
                    <div className='post-card__top-avatar'>
                        <ProgressiveImage
                            src={completedPost.avatar}
                            placeholder={completedPost.placeholder}
                        >
                            {(src, loading) =>
                                <img
                                    style={{
                                        filter: loading && 'blur(1px}',
                                        'WebkitFilter': loading && 'blur(1px)'
                                    }}
                                    width='64'
                                    height='64'
                                    src={src}
                                    className='avatar img-shadowed pointer'
                                    onClick={(e) => navigateToUserProfile(e)}
                                    alt="mdo" />}
                        </ProgressiveImage>
                    </div>
                    <div className='post-card__top-names'>
                        <p
                            onClick={(e) => navigateToUserProfile(e)}
                            className='mb-0 pointer'>{completedPost.name}</p>
                        <p
                            onClick={(e) => navigateToUserProfile(e)}
                            className={
                                'pointer ' + (completedPost.name ? '' :
                                    'post-card__top-no-top-margin')}>
                            {'@' + completedPost.username}</p>
                    </div>
                    <div className={
                        'post-card__top-created ' +
                        (isMyPost ? '' : 'pe-0')}>
                        <p>{getDateCreatedPostCard(completedPost.created)}</p>
                    </div>
                    {isMyPost && <div ref={dropRef} className='c-dropdown'>
                        <div
                            onClick={(e) => {
                                e.stopPropagation()
                                setShowDropdown(!showDropdown)
                            }}
                            className='c-dropdown__toggle pointer'>
                            <img
                                className='ellipsis-img'
                                src={createImageSrcUrl(ellipsis)}
                                alt="" width='15' height='15' />
                        </div>
                        <div className={
                            'c-dropdown__body-post c-dropdown__body ' +
                            (showDropdown ? 'c-dropdown__body-show' : '')}>
                            <div
                                className='c-dropdown__el-post c-dropdown__el pointer'
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setShowDropdown(false)
                                    setShowPostDeleteModal(true)
                                }}
                            >
                                <img
                                    src={createImageSrcUrl(trash)}
                                    alt="" height='20' width='20' />
                                <span style={{ color: 'red' }}>Delete</span>
                            </div>
                        </div>
                    </div>}
                </div>
                <div>
                    <p className='post-card__text mt-1'>{handlePostText(completedPost.text)}</p>
                </div>
                <div className='post-card__footer'>
                    <div>
                        {completedPost.hasILiked ?
                            <img
                                onClick={(e) => handleLikeBtnClicked(e)}
                                className='filled-heart pointer'
                                src={createImageSrcUrl(heart_filled)}
                                alt="" width='18' height='18' /> :
                            <img
                                onClick={(e) => handleLikeBtnClicked(e)}
                                className='pointer'
                                src={createImageSrcUrl(heart)}
                                alt="" width='18' height='18' />}
                        {completedPost.numberOfLikes ?
                            <p className={completedPost.hasILiked ? 'special-red' : ''}>
                                {getFinalStringForNumber(completedPost.numberOfLikes)}
                            </p> : <p>&nbsp;</p>}
                    </div>
                    <div>
                        <img
                            src={createImageSrcUrl(comment)}
                            alt="" width='18' height='18' />
                        {/* <p>0</p> */}
                    </div>
                </div>
            </div>
        </>
    )
}
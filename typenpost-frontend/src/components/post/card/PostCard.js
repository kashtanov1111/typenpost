import { createImagePlaceholderUrl } from '../../../functions/functions'
import { createImageSrcUrl } from '../../../functions/functions'
import { getDateCreatedPostCard } from '../../../functions/functions'
import { PostDeleteModal } from '../PostDeleteModal'
import { usePostLiking } from '../../../customHooks/usePostLiking'
import { useNavigate, useLocation } from 'react-router-dom'
import { useOutsideAlerter } from '../../../customHooks/useOtsideAlerter'
import comment from '../../../assets/images/chat-left.svg'
import ellipsis from '../../../assets/images/three-dots-vertical.svg'
import heart from '../../../assets/images/heart.svg'
import heart_filled from '../../../assets/images/heart-fill.svg'
import nobody from '../../../assets/images/nobody.jpg'
import ProgressiveImage from 'react-progressive-graceful-image'
import React, { useRef, useState } from "react";
import trash from '../../../assets/images/trash-red.svg'
import { handleText } from '../../../functions/functions'
import Linkify from 'linkify-react'
import { optionsForTextInCards } from '../../../functions/functions'

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
    handleLikeClickForPostDetail,
    handleShowAutoFocus
}) {

    // console.log('Post Card Render')
    const navigate = useNavigate()
    const location = useLocation()
    const [showDropdown, setShowDropdown] = useState(false)
    const dropRef = useRef(null)
    const options = optionsForTextInCards

    useOutsideAlerter(dropRef, () => {
        setShowDropdown(false)
    })

    var completedPost = {}
    if (fromPostDetail !== true) {
        completedPost.created = post.created
        completedPost.text = post.text
        completedPost.id = post.id
        completedPost.uuid = post.uuid
        completedPost.numberOfLikes = post.numberOfLikes
        completedPost.numberOfComments = post.numberOfComments
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
    const liking = usePostLiking(completedPost, handleAlert)
    const handleLikePost = liking.handleLikePost

    function navigateToUserProfile(e) {
        e.stopPropagation()
        if (fromPostFeed || fromPostDetail) {
            navigate('../profile/' + completedPost.username)
        }
    }

    function navigateToPostDetail(e, autoFocusShow = false) {
        e.stopPropagation()
        if (!fromPostDetail) {
            navigate('../' + completedPost.uuid, { state: { completedPost: completedPost, from: true, autoFocusShow: autoFocusShow } })
        } else if (autoFocusShow === true) {
            handleShowAutoFocus()
        }
    }

    function handleLikeBtnClicked(e) {
        e.stopPropagation()
        if (authUsername) {
            handleLikePost()
            if (handleLikeClickForPostDetail) {
                handleLikeClickForPostDetail()
            }
        } else {
            navigate('../login', { replace: true, state: location.pathname })
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
            <div onClick={(e) => navigateToPostDetail(e)} className='post-card pointer'>
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
                        <p className='mb-0 pointer'>
                            <span onClick={(e) => navigateToUserProfile(e)}>
                                {completedPost.name}
                            </span>
                        </p>
                        <p className={
                            'pointer ' + (completedPost.name ? '' :
                                'post-card__top-no-top-margin')}>
                            <span onClick={(e) => navigateToUserProfile(e)}>
                                {'@' + completedPost.username}
                            </span>
                        </p>
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
                    <Linkify as='p' className={'post-card__text ' +
                        (fromPostDetail ? 'mt-3 ' : 'ps-5 ') +
                        (completedPost.name ? '' : 'card-text-lifted')}
                        options={options}
                    >
                        {handleText(
                            completedPost.text,
                            fromPostDetail,
                            true)}
                    </Linkify>
                </div>
                <div className={'post-card__footer ' +
                    (fromPostDetail ? '' : 'ms-5')}>
                    <div>
                        {(completedPost.hasILiked && authUsername) ?
                            <img
                                onClick={(e) => handleLikeBtnClicked(e)}
                                className='filled-heart pointer'
                                src={createImageSrcUrl(heart_filled)}
                                alt="" width='20' height='20' /> :
                            <img
                                onClick={(e) => handleLikeBtnClicked(e)}
                                className='pointer'
                                src={createImageSrcUrl(heart)}
                                alt="" width='20' height='20' />}
                        {(completedPost.numberOfLikes !== 0) &&
                            <p className={(completedPost.hasILiked && authUsername) ? 'special-red' : ''}>
                                {getFinalStringForNumber(completedPost.numberOfLikes) + ' like' + (completedPost.numberOfLikes !== 1 ? 's' : '')}
                            </p>}
                    </div>
                    <div>
                        <img
                            src={createImageSrcUrl(comment)}
                            onClick={(e) => navigateToPostDetail(e, true)}
                            alt="" width='20' height='20' />
                        {(completedPost.numberOfComments !== 0) && 
                            <p>
                                {getFinalStringForNumber(completedPost.numberOfComments) + 
                                (completedPost.numberOfComments !== 1 ? ' replies' : ' reply')}
                            </p>}
                    </div>
                </div>
            </div>
        </>
    )
}
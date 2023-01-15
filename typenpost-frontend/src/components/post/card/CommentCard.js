import { createImageSrcUrl } from '../../../functions/functions'
import { CommentDeleteModal } from '../CommentDeleteModal'
import { useCommentLiking } from '../../../customHooks/useCommentLiking'
import { useOutsideAlerter } from '../../../customHooks/useOtsideAlerter'
import comment_image from '../../../assets/images/chat-left.svg'
import ellipsis from '../../../assets/images/three-dots-vertical.svg'
import heart from '../../../assets/images/heart.svg'
import heart_filled from '../../../assets/images/heart-fill.svg'
import React, { useRef, useState } from "react";
import trash from '../../../assets/images/trash-red.svg'
import ProgressiveImage from "react-progressive-graceful-image"
import { useNavigate, useLocation } from "react-router-dom"
import nobody from '../../../assets/images/nobody.jpg'
import {
    createImagePlaceholderUrl,
    getFinalStringForNumber
} from "../../../functions/functions"
import { getDateCreatedPostCard } from "../../../functions/functions"
import { handleText } from "../../../functions/functions"

export function CommentCard({
    comment,
    authUsername,
    postId,
    handleAlert
}) {
    const navigate = useNavigate()
    const location = useLocation()
    var avatar = null
    var isMyComment = null
    const dropRef = useRef(null)

    const [showDropdown, setShowDropdown] = useState(false)
    const [showCommentDeleteModal, setShowCommentDeleteModal] = useState(false)
    const liking = useCommentLiking(comment, handleAlert)
    const handleLikeComment = liking.handleLikeComment

    useOutsideAlerter(dropRef, () => setShowDropdown(false))
    
    if (comment) {
        avatar = comment.user.profile.avatar
        isMyComment = comment.user.username === authUsername
    }

    function navigateToUserProfile() {
        navigate('../profile/' + comment.user.username)
    }

    async function handleLikeBtnClicked() {
        if (authUsername) {
            await handleLikeComment()
        } else {
            navigate('../login', { replace: true, state: location.pathname })
        }
    }

    return (
        <>
            <CommentDeleteModal
                commentId={comment.id}
                postId={postId}
                commentUUID={comment.uuid}
                showCommentDeleteModal={showCommentDeleteModal}
                setShowCommentDeleteModal={setShowCommentDeleteModal}
                handleAlert={handleAlert}
            />
            <div className='comment-card pointer'>
                <div className='comment-card__top'>
                    <div className='comment-card__top-avatar'>
                        <ProgressiveImage
                            src={avatar ? avatar : nobody}
                            placeholder={avatar ?
                                createImagePlaceholderUrl(
                                    avatar, '50x50') : nobody}
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
                                    onClick={navigateToUserProfile}
                                    alt="mdo" />}
                        </ProgressiveImage>
                    </div>
                    <div className='comment-card__top-names'>
                        <p className='mb-0 pointer'>
                            <span onClick={(e) => navigateToUserProfile(e)}>
                                {comment.user.name}
                            </span>
                        </p>
                        <p className={
                            'pointer ' + (comment.user.name ? '' :
                                'comment-card__top-no-top-margin')}>
                            <span onClick={(e) => navigateToUserProfile(e)}>
                                {'@' + comment.user.username}
                            </span>
                        </p>
                    </div>
                    <div className={'comment-card__top-created ' +
                        (isMyComment ? '' : 'pe-0')}>
                        <p>{getDateCreatedPostCard(comment.created)}</p>
                    </div>
                    {isMyComment && <div ref={dropRef} className='c-dropdown'>
                        <div
                            onClick={() => {
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
                                    setShowCommentDeleteModal(true)
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
                    <p className={'comment-card__text ps-5 ' +
                        (comment.user.name ? '' : 'card-text-lifted')}>
                        {handleText(comment.text)}
                    </p>
                </div>
                <div className='comment-card__footer ms-5'>
                    <div>
                        {(comment.hasILiked && authUsername) ?
                            <img
                                onClick={handleLikeBtnClicked}
                                className='filled-heart pointer'
                                src={createImageSrcUrl(heart_filled)}
                                alt="" width='20' height='20' /> :
                            <img
                                onClick={handleLikeBtnClicked}
                                className='pointer'
                                src={createImageSrcUrl(heart)}
                                alt="" width='20' height='20' />}
                        {comment.numberOfLikes ?
                            <p className={(comment.hasILiked && authUsername) ? 'special-red' : ''}>
                                {getFinalStringForNumber(comment.numberOfLikes) + ' like' + (comment.numberOfLikes !== 1 ? 's' : '')}
                            </p> : <p>&nbsp;</p>}
                    </div>
                    <div>
                        <img
                            src={createImageSrcUrl(comment_image)}
                            alt="" width='20' height='20' />
                        {comment.numberOfComments ?
                            <p>
                                {getFinalStringForNumber(comment.numberOfComments)}
                            </p> : <p>&nbsp;</p>}
                    </div>
                </div>
            </div>
        </>
    )
}
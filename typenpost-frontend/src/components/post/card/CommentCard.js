import { createImageSrcUrl } from '../../../functions/functions'
import { CommentDeleteModal } from '../CommentDeleteModal'
import { useCommentLiking } from '../../../customHooks/useCommentLiking'
import { useOutsideAlerter } from '../../../customHooks/useOtsideAlerter'
import comment_image from '../../../assets/images/chat-left.svg'
import ellipsis from '../../../assets/images/three-dots-vertical.svg'
import heart from '../../../assets/images/heart.svg'
import heart_filled from '../../../assets/images/heart-fill.svg'
import React, { useEffect, useRef, useState } from "react";
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
import { COMMENT_REPLIES } from '../../../gqls/queries'
import { useLazyQuery } from '@apollo/client'
import { SpinnerForPages } from '../../SpinnerForPages'
import Linkify from 'linkify-react'
import { optionsForTextInCards } from '../../../functions/functions'

export function CommentCard({
    authUsername,
    comment,
    handleAlert,
    handleShowAutoFocus,
    mainComment,
    parentCommentId,
    parentCommentUUID,
    post,
    postId,
    refetchRepliesOfCommentUUID,
    setCommentUserUsername,
    setCommentUUID,
    setCommentId,
    setPost,
    setRefetchRepliesOfCommentUUID
}) {
    
    const navigate = useNavigate()
    const location = useLocation()
    var avatar = null
    var isMyComment = null
    const dropRef = useRef(null)
    const options = optionsForTextInCards

    const [showDropdown, setShowDropdown] = useState(false)
    const [repliesAreShown, setRepliesAreShown] = useState(null)
    const [showCommentDeleteModal, setShowCommentDeleteModal] = useState(false)
    const [numberOfRepliesToShow, setNumberOfRepliesToShow] = useState(10)
    const [loadingOnFetchMore, setLoadingOnFetchMore] = useState(false)
    const liking = useCommentLiking(comment, handleAlert)
    const handleLikeComment = liking.handleLikeComment
    var hasNextPageForReplies = null

    const [getReplies, {
        data: dataReplies,
        loading: loadingReplies,
        fetchMore,
        refetch: refetchReplies
    }] = useLazyQuery(COMMENT_REPLIES, {
        variables: {
            uuid: comment.uuid,
            first: numberOfRepliesToShow
        },
        onError: () => {
            handleAlert('An error occured, please try again.', 'danger')
        },
    })

    if (dataReplies) {
        hasNextPageForReplies =
            dataReplies.comment.replies.pageInfo.hasNextPage
    }

    if (comment) {
        avatar = comment.user.profile.avatar
        isMyComment = comment.user.username === authUsername
    }

    useOutsideAlerter(dropRef, () => setShowDropdown(false))

    useEffect(() => {
        if (refetchRepliesOfCommentUUID === comment.uuid) {
            refetchReplies()
            setRepliesAreShown(true)
            setRefetchRepliesOfCommentUUID(false)
        }
    }, [
        refetchRepliesOfCommentUUID, 
        setRefetchRepliesOfCommentUUID,
        comment.uuid, 
        refetchReplies])

    async function handleShowMoreRepliesClick() {
        if (hasNextPageForReplies) {
            setLoadingOnFetchMore(true)
            await fetchMore({
                variables: {
                    first: numberOfRepliesToShow + 10
                }
            })
            setLoadingOnFetchMore(false)

            setNumberOfRepliesToShow(numberOfRepliesToShow + 10)
        }
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
                commentUUID={comment.uuid}
                handleAlert={handleAlert}
                parentCommentId={parentCommentId}
                post={post}
                postId={postId}
                setPost={setPost}
                setShowCommentDeleteModal={setShowCommentDeleteModal}
                showCommentDeleteModal={showCommentDeleteModal}
            />
            <div className='comment-card pointer'>
                <div className='comment-card__top'>
                    <div className={'comment-card__top-avatar' +
                        (mainComment ? '' : ' comment-card__top-avatar--small')}>
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
                    <Linkify as='p' className={'comment-card__text' +
                        (mainComment ? ' ps-5 ' : ' ps-2-and-5rem ') +
                        (comment.user.name ? '' :
                            (mainComment ? 'card-text-lifted' : 'card-text-lifted--reply'))}
                        options={options}>
                        {handleText(comment.text)}
                    </Linkify>
                </div>
                <div className={'comment-card__footer ' +
                    (mainComment ? 'ms-5' : 'ms-2-and-5rem')}>
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
                        {(comment.numberOfLikes !== 0) &&
                            <p 
                                onClick={() => navigate('/comment/' + comment.uuid + '/likes')}
                                className={(comment.hasILiked && authUsername) ? 'special-red' : ''}>
                                {getFinalStringForNumber(comment.numberOfLikes) + ' like' + (comment.numberOfLikes !== 1 ? 's' : '')}
                            </p>}
                    </div>
                    <div>
                        <img
                            onClick={() => {
                                handleShowAutoFocus()
                                if (mainComment) {
                                    setCommentUUID(comment.uuid)
                                    setCommentId(comment.id)
                                } else {
                                    setCommentUUID(parentCommentUUID)
                                    setCommentId(parentCommentId)
                                }
                                setCommentUserUsername(comment.user.username)
                            }}
                            src={createImageSrcUrl(comment_image)}
                            alt="" width='20' height='20' />
                        {mainComment &&
                            ((comment.numberOfReplies !== 0) &&
                                <p onClick={() => {
                                        setRepliesAreShown(true)
                                        getReplies()
                                    }}>
                                    {getFinalStringForNumber(comment.numberOfReplies) +
                                        ' repl' +
                                        (comment.numberOfReplies === 1 ? 'y' : 'ies')}
                                </p>)}
                    </div>
                </div>
            </div>
            <div className='ms-5'>
                {repliesAreShown && dataReplies && dataReplies.comment.replies.edges.map((el) => (
                    el.node &&
                    <CommentCard
                        key={el.node.id}
                        comment={el.node}
                        postId={postId}
                        authUsername={authUsername}
                        handleAlert={handleAlert}
                        parentCommentId={comment.id}
                        parentCommentUUID={comment.uuid}
                        handleShowAutoFocus={handleShowAutoFocus}
                        post={post}
                        setPost={setPost}
                        setCommentUUID={setCommentUUID}
                        setCommentId={setCommentId}
                        setCommentUserUsername={setCommentUserUsername}
                    />
                ))}
                {(loadingReplies || loadingOnFetchMore) && <SpinnerForPages />}
                {dataReplies && hasNextPageForReplies &&
                    <p
                        className='pb-3'
                        style={{ marginTop: '-0.5rem' }}>
                        <span 
                            onClick={handleShowMoreRepliesClick}>
                            &mdash; Show more replies</span>
                    </p>}
                {!hasNextPageForReplies && comment.numberOfReplies !== 0 && repliesAreShown &&
                    <p
                        className='pb-3'
                        style={{ marginTop: '-0.5rem' }}>
                        <span onClick={() => setRepliesAreShown(false)}>
                            &mdash; Hide repl{comment.numberOfReplies === 1 ? 'y' : 'ies'}</span>
                    </p>}
            </div>
        </>
    )
}
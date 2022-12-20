import trash from '../../../assets/images/trash-red.svg'
import ellipsis from '../../../assets/images/three-dots-vertical.svg'
import heart from '../../../assets/images/heart.svg'
import heart_filled from '../../../assets/images/heart-fill.svg'
import comment from '../../../assets/images/chat-left.svg'
import React, { useEffect, useState } from "react";
import ProgressiveImage from 'react-progressive-graceful-image'
import { createImageSrcUrl } from '../../../functions/functions'
import { POST_LIKING, POST_DELETING } from '../../../gqls/mutations'
import { useMutation } from '@apollo/client'
import Dropdown from 'react-bootstrap/Dropdown'
import { CustomToggle } from '../../../CustomToggle';
import { PostDeleteModal } from '../PostDeleteModal'
import { createImagePlaceholderUrl } from '../../../functions/functions'
import nobody from '../../../assets/images/nobody.jpg'

export function PostCard({
    post,
    avatarSrc,
    placeholderProfileSrc,
    improvedUserData,
    userUsername,
    yearNow,
    getFinalStringForNumber,
    handleAlert,
    authUsername
}) {

    console.log('Post Card Render')

    const [hasILiked, setHasILiked] = useState(post.hasILiked)
    const [numberOfLikes, setNumberOfLikes] = useState(post.numberOfLikes)
    const [showPostDeleteModal, setShowPostDeleteModal] = useState(false)
    const avatar = avatarSrc ? avatarSrc : 
        (post.user.profile.avatar ? post.user.profile.avatar : nobody)
    const placeholder = placeholderProfileSrc ? placeholderProfileSrc :
        (post.user.profile.avatar ? createImagePlaceholderUrl(post.user.profile.avatar, '50x50') : nobody)
    const username = userUsername ? userUsername : post.user.username
    const name = improvedUserData ? improvedUserData.name : post.user.name
    const isMyPost = username === authUsername

    function handleLikeBtnClicked() {
        if (hasILiked === false) {
            setHasILiked(true)
            setNumberOfLikes(numberOfLikes + 1)
            handleLikePost()
        } else {
            setHasILiked(false)
            setNumberOfLikes(numberOfLikes - 1)
            handleLikePost()
        }
    }

    const [handleLikePost] = useMutation(
        POST_LIKING, {
        variables: {
            uuid: post.uuid
        },
        update(cache, { data: { likePost } }) {
            cache.modify({
                id: 'PostNode:' + post.id,
                fields: {
                    hasILiked() {
                        if (likePost.action ===
                            'liked') {
                            return true
                        } else {
                            return false
                        }
                    }
                }
            })
        },
        onError: () => {
            handleAlert('An error occured, please try again.', 'danger')
        }
    }
    )

    useEffect(() => {
        setNumberOfLikes(post.numberOfLikes)
    }, [post.numberOfLikes])

    function handlePostText(text) {
        if (text.length > 500) {
            return text.slice(0, 500) + '...'
        } else {
            return text
        }
    }

    function getDateJoinedPostCard(string) {
        const d = new Date(string)
        if (d.getFullYear() < yearNow) {
            return d.toLocaleDateString(
                'en-us', { day: 'numeric', month: 'short', year: 'numeric' })
        } else {
            var seconds = Math.floor((new Date() - d) / 1000);
            var interval = seconds / 86400;
            if (interval > 1) {
                return d.toLocaleDateString(
                    'en-us', { day: 'numeric', month: 'short' })
            }
            interval = seconds / 3600;
            if (interval > 1) {
                return Math.floor(interval) + "h";
            }
            interval = seconds / 60;
            if (interval > 1) {
                return Math.floor(interval) + "m";
            }
            return Math.floor(seconds) + "s";
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
        />
        <div className='post-card'>
            <div className='post-card__top'>
                <div>
                    <ProgressiveImage
                        src={avatar}
                        placeholder={placeholder}
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
                                className='img-shadowed'
                                alt="mdo" />}
                    </ProgressiveImage>
                </div>
                <div>
                    <p className='mb-0'>{name}</p>
                    <p className={name ? '' : 'post-card__top-no-top-margin'}>{'@' + username}</p>
                </div>
                <div className={isMyPost ? '' : 'pe-0'}>
                    <p>{getDateJoinedPostCard(post.created)}</p>
                </div>
                {isMyPost && <Dropdown>
                    <Dropdown.Toggle
                        as={CustomToggle}
                        id="dropdown-menu-align-responsive-2">
                        <div as={Dropdown}>
                            <img className='ellipsis-img' src={createImageSrcUrl(ellipsis)} alt="" width='15' height='15' />
                        </div>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className='py-0 m-0'>
                        <Dropdown.Item
                            className='post-card__dropdown-item py-2'
                            onClick={() => setShowPostDeleteModal(true)}
                        >
                            <img src={createImageSrcUrl(trash)} alt="" height='20' width='20' />
                            <span>Delete</span>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>}
            </div>
            <div>
                <p className='mt-1'>{handlePostText(post.text)}</p>
            </div>
            <div className='post-card__footer'>
                <div>
                    {hasILiked ?
                        <img
                            onClick={handleLikeBtnClicked}
                            className='filled-heart pointer'
                            src={createImageSrcUrl(heart_filled)}
                            alt="" width='18' height='18' /> :
                        <img
                            onClick={handleLikeBtnClicked}
                            className='pointer'
                            src={createImageSrcUrl(heart)}
                            alt="" width='18' height='18' />}
                    {numberOfLikes !== 0 ? <p className={hasILiked ? 'special-red' : ''}>{getFinalStringForNumber(numberOfLikes)}</p> : <p>&nbsp;</p>}
                </div>
                <div>
                    <img src={createImageSrcUrl(comment)} alt="" width='18' height='18' />
                    {/* <p>0</p> */}
                </div>
            </div>
        </div>
        </>
    )
}
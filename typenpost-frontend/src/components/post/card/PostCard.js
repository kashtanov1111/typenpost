import ellipsis from '../../../assets/images/three-dots-vertical.svg'
import heart from '../../../assets/images/heart.svg'
import heart_filled from '../../../assets/images/heart-fill.svg'
import comment from '../../../assets/images/chat-left.svg'
import React from "react";
import ProgressiveImage from 'react-progressive-graceful-image'
import { createImageSrcUrl } from '../../../functions/functions'
import { POST_LIKING } from '../../../gqls/mutations'
import { useMutation } from '@apollo/client'

export function PostCard({
    post,
    avatarSrc,
    placeholderProfileSrc,
    improvedUserData,
    userUsername,
    yearNow,
    getFinalStringForNumber
}) {
    const numberOfLikes = post.numberOfLikes

    const [handleLikePost, {error: errorLikePost}] = useMutation(
        POST_LIKING, {
            variables: {
                uuid: post.uuid
            },
            onCompleted: (data) => console.log(data),
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
        }
    )
    
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
        <div className='post-card'>
            <div className='post-card__top'>
                <div>
                    <ProgressiveImage
                        src={avatarSrc}
                        placeholder={placeholderProfileSrc}
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
                    <p className='mb-0'>{improvedUserData.name}</p>
                    <p className={improvedUserData.name ? '' : 'post-card__top-no-top-margin'}>{'@' + userUsername}</p>
                </div>
                <div>
                    <p>{getDateJoinedPostCard(post.created)}</p>
                </div>
                <div>
                    <img src={createImageSrcUrl(ellipsis)} alt="" width='15' height='15'/>
                </div>
            </div>
            <div>
                <p className='mt-1'>{handlePostText(post.text)}</p>
            </div>
            <div className='post-card__footer'>
                <div>
                    {post.hasILiked ?
                    <img onClick={handleLikePost} className='filled-heart' src={createImageSrcUrl(heart_filled)} alt="" width='18' height='18'/> :
                    <img onClick={handleLikePost} src={createImageSrcUrl(heart)} alt="" width='18' height='18'/>}
                    <p className={post.hasILiked ? 'special-red' : ''}>{numberOfLikes !== 0 && getFinalStringForNumber(numberOfLikes)}</p>
                </div>
                <div>
                    <img src={createImageSrcUrl(comment)} alt="" width='18' height='18'/>
                    {/* <p>0</p> */}
                </div>
            </div>
        </div>
    )
}
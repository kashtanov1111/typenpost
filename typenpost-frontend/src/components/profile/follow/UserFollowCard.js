import React, { useEffect, useState } from "react";
import nobody from '../../../assets/images/nobody.jpg'
import { useNavigate } from "react-router-dom";
import ProgressiveImage from 'react-progressive-graceful-image'
import Button from 'react-bootstrap/Button'

import { createImagePlaceholderUrl } from '../../../functions/functions';
import { useFollowing } from "../../../customHooks/useFollowing";

export function UserFollowCard({
    profile,
    handleAlert,
    username,
    forLikes
}) {
    if (forLikes) {
        profile = {
            id: profile.profile.id,
            avatar: profile.profile.avatar,
            amIFollowing: profile.profile.amIFollowing,
            isHeFollowing: profile.profile.isHeFollowing,
            user: {
                id: profile.id,
                name: profile.name,
                username: profile.username
            }
        }
    }
    const userUsername = profile.user.username
    const avatar = profile.avatar
    const [amIFollowing, setAmIFollowing] = useState(
        profile && profile.amIFollowing)
    const following = useFollowing(
        userUsername,
        amIFollowing,
        profile,
        handleAlert)
    const handleFollow = following.handleFollow
    const navigate = useNavigate()

    useEffect(() => {
        if (profile) {
            setAmIFollowing(profile.amIFollowing)
        }
    }, [profile])

    return (
        <div
            onClick={() => navigate(
                '../../profile/' + userUsername, { replace: true })}
            className='user-follow-card'>
            <div>
                <ProgressiveImage
                    src={avatar ?
                        avatar : nobody}
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
                            className='img-shadowed'
                            src={src}
                            alt="mdo" />}
                </ProgressiveImage>
            </div>
            <div>
                <p>{profile.user.name}</p>
                <p>{'@' + userUsername}</p>
            </div>
            {username !== userUsername && <div>
                {amIFollowing ?
                    <Button
                        size='sm'
                        variant='following'
                        className="follow-list-btn"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleFollow()
                        }}
                    >
                        <span>Following</span>
                    </Button> :
                    <Button
                        className='follow-list-btn'
                        size='sm'
                        variant='primary'
                        onClick={(e) => {
                            e.stopPropagation()
                            handleFollow()
                        }}>
                        {
                            (profile.isHeFollowing ? 'Follow back' : 'Follow')
                        }
                    </Button>
            }
        </div>}
        </div >
    )
}
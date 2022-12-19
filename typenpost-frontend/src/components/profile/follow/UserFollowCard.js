import React, { useContext } from "react";
import nobody from '../../../assets/images/nobody.jpg'
import { useNavigate } from "react-router-dom";
import ProgressiveImage from 'react-progressive-graceful-image'
import Button from 'react-bootstrap/Button'
import Spinner from "react-bootstrap/esm/Spinner";

import { createImagePlaceholderUrl } from '../../../functions/functions';
import { useFollowing } from "../../../customHooks/useFollowing";

export function UserFollowCard({
    profile,
    handleAlert,
    username
}) {
    const userUsername = profile.user.username
    const avatar = profile.avatar
    const following = useFollowing(
        handleAlert, userUsername, profile)
    const handleFollow = following.handleFollow
    const loadingFollowingUser = following.loadingFollowingUser
    const navigate = useNavigate()

    function handleFollowBtnClicked(e) {
        e.stopPropagation()
        handleFollow()
    }
    
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
                            src={src}
                            alt="mdo" />}
                </ProgressiveImage>
            </div>
            <div>
                <p>{profile.user.name}</p>
                <p>{'@' + userUsername}</p>
            </div>
            {username !== userUsername && <div>
                {profile.amIFollowing ?
                    <Button
                        size='sm'
                        variant='following'
                        className="follow-list-btn"
                        onClick={handleFollowBtnClicked}
                    >
                        {loadingFollowingUser ?
                            <div><Spinner
                                as='span'
                                animation='border'
                                size='sm'
                                role='status'
                                aria-hidden='true' />
                                <span className='visually-hidden'>
                                    Loading...</span>
                            </div> :
                            <span>Following</span>
                        }
                    </Button> :
                    <Button
                        className='follow-list-btn'
                        size='sm'
                        variant='primary'
                        onClick={handleFollowBtnClicked}>
                        {loadingFollowingUser ?
                            <div><Spinner
                                as='span'
                                animation='border'
                                size='sm'
                                role='status'
                                aria-hidden='true' />
                                <span className='visually-hidden'>
                                    Loading...</span>
                            </div> :
                            (profile.isHeFollowing ? 'Follow back' : 'Follow')
                        }
                    </Button>
                }
            </div>}
        </div>
    )
}
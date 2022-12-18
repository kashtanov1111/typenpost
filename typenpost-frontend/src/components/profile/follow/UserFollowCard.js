import React from "react";
import nobody from '../../../assets/images/nobody.jpg'
import { Link } from "react-router-dom";
import ProgressiveImage from 'react-progressive-graceful-image'
import Button from 'react-bootstrap/Button'
import Spinner from "react-bootstrap/esm/Spinner";
import Placeholder from 'react-bootstrap/Placeholder'

import { createImagePlaceholderUrl } from '../../../functions/functions';

export function UserFollowCard({
    profile,
    handleFollow,
    loadingFollowingUser,
    loadingUserFollowers,
}) {
    console.log(profile.isHeFollowing)
    return (
        <div className='user-follow-card'>
            <div>
                <ProgressiveImage
                    src={profile.avatar ?
                        profile.avatar : nobody}
                    placeholder={profile.avatar ?
                        createImagePlaceholderUrl(
                            profile.avatar, '50x50') : nobody}
                >
                    {(src, loading) =>
                        <img
                            style={{
                                filter: loading && 'blur(1px}',
                                'WebkitFilter': loading && 'blur(1px)'
                            }}
                            width='30'
                            height='30'
                            src={src}
                            alt="mdo" />}
                </ProgressiveImage>
            </div>
            <div>
                <h6>{profile.user.name}</h6>
                <Placeholder as='h6' animation='glow'>
                    {loadingUserFollowers ?
                        <>
                            <Placeholder xs={2} bg='secondary' />{' '}
                            <Placeholder xs={4} bg='secondary' />
                        </> :
                        profile.user.name
                    }
                </Placeholder>
                <p>{'@' + profile.user.username}</p>
            </div>
            <div>
                {profile.amIFollowing ?
                    <Button
                        size='sm'
                        variant='following'
                        className="follow-list-btn"
                        onClick={handleFollow}
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
                        onClick={handleFollow}>
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
            </div>
        </div>
        // <Card key={el.node.id} as={Link} className='bottom-border p-2' to={'/profile/' + el.node.user.username}>
        //     <Row>
        //         <Col xs='auto' className='text-center pe-1 my-auto'>
        //             <ProgressiveImage
        //                 src={el.node.avatar ?
        //                     el.node.avatar : nobody}
        //                 placeholder={el.node.avatar ?
        //                     createImagePlaceholderUrl(
        //                         el.node.avatar, '16x16') : nobody}
        //             >
        //                 {(src, loading) =>
        //                     <img
        //                         style={{
        //                             filter: loading && 'blur(8px}',
        //                             'WebkitFilter': loading && 'blur(8px)'
        //                         }}
        //                         className="rounded-circle follow-images"
        //                         src={src}
        //                         alt="mdo" />}
        //             </ProgressiveImage>
        //         </Col>
        //         <Col xs className='my-auto'>
        //             <Row>
        //                 <Col xs className='pe-0 ps-md-3 ps-1'>
        //                     {(loadingUserFollowers || el.node.user.firstName ||
        //                         el.node.lastName) &&
        //                         <Placeholder as='h6' animation='glow'
        //                             className='mb-0'>
        //                             {loadingUserFollowers ?
        //                                 <>
        //                                     <Placeholder xs={2} bg='secondary' />{' '}
        //                                     <Placeholder xs={4} bg='secondary' />
        //                                 </> :
        //                                 handleUserFirstLastName(
        //                                     el.node.user.firstName,
        //                                     el.node.user.lastName,
        //                                     width)
        //                             }
        //                         </Placeholder>}
        //                     <Placeholder as='p' animation='glow'
        //                         className='text-muted mt-0 mb-1'>
        //                         {loadingUserFollowers ?
        //                             <Placeholder xs={3} bg='secondary' /> :
        //                             '@' + el.node.user.username}
        //                     </Placeholder>
        //                 </Col>
        //                 <Col xs='auto' className='my-auto'>
        //                     {username === el.node.user.username ?
        //                         <></> :
        //                         <>
        //                             {el.node.amIFollowing ?
        //                                 <Button
        //                                     style={{ width: '85px' }}
        //                                     variant='following'
        //                                     size='sm'
        //                                     onClick={(e) => handleFollowBtnClicked(e, el.node.user.username)}
        //                                 >
        //                                     <span>Following</span>
        //                                 </Button> :
        //                                 <Button
        //                                     style={{ width: '85px' }}
        //                                     variant='primary'
        //                                     size='sm'
        //                                     onClick={(e) => handleFollowBtnClicked(e, el.node.user.username)}
        //                                 >
        //                                     <span>Follow</span>
        //                                 </Button>}
        //                         </>
        //                     }
        //                 </Col>
        //             </Row>
        //         </Col>
        //     </Row>
        // </Card>
    )
}
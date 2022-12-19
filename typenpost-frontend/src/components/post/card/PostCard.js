import nobody from '../../../assets/images/nobody.jpg'
import ellipsis from '../../../assets/images/three-dots-vertical.svg'
import heart from '../../../assets/images/heart.svg'
import heart_filled from '../../../assets/images/heart-fill.svg'
import comment from '../../../assets/images/chat-left.svg'
import React from "react";
import ProgressiveImage from 'react-progressive-graceful-image'
import { createImageSrcUrl } from '../../../functions/functions'

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
            return d.toLocaleDateString(
                'en-us', { day: 'numeric', month: 'short' })
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
                    <p>{'@' + userUsername}</p>
                </div>
                <div>
                    <p>{getDateJoinedPostCard(post.created)}</p>
                </div>
                <div>
                    <img src={createImageSrcUrl(ellipsis)} alt="" width='15' height='15'/>
                </div>
            </div>
            <div>
                <p>{handlePostText(post.text)}</p>
            </div>
            <div className='post-card__footer'>
                <div>
                    {post.hasILiked ?
                    <img src={createImageSrcUrl(heart_filled)} alt="" width='15' height='15'/> :
                    <img src={createImageSrcUrl(heart)} alt="" width='15' height='15'/>}
                    <p>{numberOfLikes !== 0 && getFinalStringForNumber(numberOfLikes)}</p>
                </div>
                <div>
                    <img src={createImageSrcUrl(comment)} alt="" width='15' height='15'/>
                    {/* <p>0</p> */}
                </div>
            </div>
        </div>
        // <Card className='bottom-border py-2'>
        // <Row className='px-2'>
        // <Col xs={2} md='auto' className='text-center pe-1'>
        //         <ProgressiveImage 
        //           src={userData && userData.user.profile.avatar ? 
        //             userData.user.profile.avatar : nobody} 
        //           placeholder={userData && userData.user.profile.avatar ? 
        //             createImagePlaceholderUrl(
        //                 userData.user.profile.avatar, '16x16') : nobody}
        //         >
        //           {(src, loading) => 
        //             <img 
        //               style={{filter: loading && 'blur(8px}', 
        //                 'WebkitFilter': loading && 'blur(8px)'}} 
        //               className="rounded-circle follow-images" 
        //               src={src}
        //               alt="mdo" />}
        //         </ProgressiveImage>
        // </Col>
        // <Col xs={10} md >
        //     <Row>
        //         <Col xs={handleSizeNumber()} md className='ps-1 pe-0'>
        //                 {(loadingUserProfile || userData.name) && 
        //                 <Placeholder as='p' animation='glow' 
        //                     style={{fontWeight: '600'}}
        //                     className='mb-0 content-special'>
        //                     {loadingUserProfile ? 
        //                     <>
        //                         <Placeholder xs={2} bg='secondary'/>{' '}
        //                         <Placeholder xs={4} bg='secondary'/>
        //                     </> : 
        //                      <>   {userData.user.name}
        //                         </>
        //                     }
        //                 </Placeholder>}
        //         </Col>
        //         <Col xs={isThisYear ? 3 : 4} md='auto' style={{textAlign: 'right'}} className='ps-0 pe-2'>
        //             <Placeholder as='p' animation='glow' 
        //                 className='mb-0 text-muted'>
        //                 {loadingUserProfile ? 
        //                 <>
        //                     <Placeholder xs={5} bg='secondary'/>
        //                 </> : 
        //                 <>
        //                 asf
        //                 {/* {isThisYear ? format(parseISO(postCreated), 
        //                 'MMM d') : format(parseISO(postCreated), 
        //                 'MMM d, yyyy')} */}
        //                 </>
        //                 }
        //         </Placeholder>
        //         </Col>
        //         {isMyProfile && <Col xs={1} md='auto' style={{textAlign: 'right'}} className='ps-0'>
        //             <Dropdown>
        //             <Dropdown.Toggle 
        //                 as={CustomToggle} 
        //                 id={"dropdown-menu-align-responsive-" + node.id}>
        //             <p className='mb-0'>
        //                 <b>···</b>
        //             </p>
        //             </Dropdown.Toggle>
        //             <Dropdown.Menu >
        //                 <Dropdown.Item
        //                 //   onClick={() => setExpanded(false)} 
        //                 className='delete-btn'
        //                 >
        //                     {/* <BiTrash style={{
        //                             verticalAlign: 'text-bottom', 
        //                             marginBottom: '2px'}}/> */}
        //                     Delete
        //                 </Dropdown.Item>
        //             </Dropdown.Menu>
        //             </Dropdown>
        //         </Col>}
        //         <Col xs={12} className='ps-1'>
        //             <Placeholder as='p' animation='glow' 
        //                         className='text-muted mt-0 mb-1'>
        //                         {loadingUserProfile ? 
        //                         <Placeholder xs={3} bg='secondary'/> :
        //                         '@' + userData.user.username}
        //             </Placeholder>
        //         </Col>
        //     </Row>
        // </Col>
        // <Col xs={12}>
        //     <p className='mt-md-2 mb-1'>{handlePostText(node.text)}</p>
        // </Col>
        // <Col>
        //     <Row>
        //         <Col xs={6} className='pointer text-center'>
        //             <h6 className='mb-0'>
        //             {/* <BiLike 
        //                 style={{
        //                     verticalAlign: 'text-bottom', 
        //                     marginBottom: '2px'}} />
        //                 {node.numberOfLikes === 0 ? '' : ' ' + node.numberOfLikes} */}
        //             </h6>
        //         </Col>
        //         <Col xs={6} className='pointer text-center'>
        //             <h6 className='mb-0'>
        //             {/* <BiCommentAdd 
        //                 style={{
        //                     verticalAlign: 'text-bottom', 
        //                     marginBottom: '1px'}} />
        //                 {/* {node.numberOfLikes === 0 ? '' : ' ' + node.numberOfLikes} */}
        //                  */}
        //             </h6>
        //         </Col>
        //     </Row>
        // </Col>
        // </Row>
        // </Card>
    )
}
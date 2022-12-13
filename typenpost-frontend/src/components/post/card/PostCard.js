import nobody from '../../../assets/images/nobody.jpg'
import React, {useState} from "react";
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Dropdown from 'react-bootstrap/Dropdown'
import {BiLike} from 'react-icons/bi'
import {BiCommentAdd} from 'react-icons/bi'
import {BiCommentCheck} from 'react-icons/bi'
import {BiTrash} from 'react-icons/bi'
import { CustomToggle } from '../../../CustomToggle';
import {format, parseISO } from 'date-fns'

import ProgressiveImage from 'react-progressive-graceful-image'
import Placeholder from 'react-bootstrap/Placeholder'
import { 
    createImagePlaceholderUrl } from '../../../functions/functions';


export function PostCard(props) {
    const {
        node,
        userData,
        loadingUserProfile,
        yearNow,
        isMyProfile,
    } = props
    const postYear = parseInt(format(parseISO(node.created), 
    'yyyy'))
    const isThisYear = postYear === yearNow
    const postCreated = node.created
    function handlePostText(text) {
        if (text.length > 500) {
            return text.slice(0, 500) + '...'
        } else {
            return text
        }
    }

    function handleSizeNumber() {
        var size = 0
        if (isThisYear) {
            size = 8            
        } else {
            size = 7
        }
        if (!isMyProfile) {
            return size + 1
        } else {
            return size
        }
    }
    return (
        <Card className='bottom-border py-2'>
        <Row className='px-2'>
        <Col xs={2} md='auto' className='text-center pe-1'>
                <ProgressiveImage 
                  src={userData && userData.user.profile.avatar ? 
                    userData.user.profile.avatar : nobody} 
                  placeholder={userData && userData.user.profile.avatar ? 
                    createImagePlaceholderUrl(
                        userData.user.profile.avatar, '16x16') : nobody}
                >
                  {(src, loading) => 
                    <img 
                      style={{filter: loading && 'blur(8px}', 
                        'WebkitFilter': loading && 'blur(8px)'}} 
                      className="rounded-circle follow-images" 
                      src={src}
                      alt="mdo" />}
                </ProgressiveImage>
        </Col>
        <Col xs={10} md >
            <Row>
                <Col xs={handleSizeNumber()} md className='ps-1 pe-0'>
                        {(loadingUserProfile || userData.user.firstName || 
                            userData.user.lastName) && 
                        <Placeholder as='p' animation='glow' 
                            style={{fontWeight: '600'}}
                            className='mb-0 content-special'>
                            {loadingUserProfile ? 
                            <>
                                <Placeholder xs={2} bg='secondary'/>{' '}
                                <Placeholder xs={4} bg='secondary'/>
                            </> : 
                             <>   {userData.user.firstName + ' ' +
                                userData.user.lastName}
                                </>
                            }
                        </Placeholder>}
                </Col>
                <Col xs={isThisYear ? 3 : 4} md='auto' style={{textAlign: 'right'}} className='ps-0 pe-2'>
                    <Placeholder as='p' animation='glow' 
                        className='mb-0 text-muted'>
                        {loadingUserProfile ? 
                        <>
                            <Placeholder xs={5} bg='secondary'/>
                        </> : 
                        <>
                        {isThisYear ? format(parseISO(postCreated), 
                        'MMM d') : format(parseISO(postCreated), 
                        'MMM d, yyyy')}
                        </>
                        }
                </Placeholder>
                </Col>
                {isMyProfile && <Col xs={1} md='auto' style={{textAlign: 'right'}} className='ps-0'>
                    <Dropdown>
                    <Dropdown.Toggle 
                        as={CustomToggle} 
                        id={"dropdown-menu-align-responsive-" + node.id}>
                    <p className='mb-0'>
                        <b>···</b>
                    </p>
                    </Dropdown.Toggle>
                    <Dropdown.Menu >
                        <Dropdown.Item
                        //   onClick={() => setExpanded(false)} 
                        className='delete-btn'
                        >
                            <BiTrash style={{
                                    verticalAlign: 'text-bottom', 
                                    marginBottom: '2px'}}/>
                            {' '}Delete
                        </Dropdown.Item>
                    </Dropdown.Menu>
                    </Dropdown>
                </Col>}
                <Col xs={12} className='ps-1'>
                    <Placeholder as='p' animation='glow' 
                                className='text-muted mt-0 mb-1'>
                                {loadingUserProfile ? 
                                <Placeholder xs={3} bg='secondary'/> :
                                '@' + userData.user.username}
                    </Placeholder>
                </Col>
            </Row>
        </Col>
        <Col xs={12}>
            <p className='mt-md-2 mb-1'>{handlePostText(node.text)}</p>
        </Col>
        <Col>
            <Row>
                <Col xs={6} className='pointer text-center'>
                    <h6 className='mb-0'>
                    <BiLike 
                        style={{
                            verticalAlign: 'text-bottom', 
                            marginBottom: '2px'}} />
                        {node.numberOfLikes === 0 ? '' : ' ' + node.numberOfLikes}
                    </h6>
                </Col>
                <Col xs={6} className='pointer text-center'>
                    <h6 className='mb-0'>
                    <BiCommentAdd 
                        style={{
                            verticalAlign: 'text-bottom', 
                            marginBottom: '1px'}} />
                        {/* {node.numberOfLikes === 0 ? '' : ' ' + node.numberOfLikes} */}
                        
                    </h6>
                </Col>
            </Row>
        </Col>
        </Row>
        </Card>
    )
}
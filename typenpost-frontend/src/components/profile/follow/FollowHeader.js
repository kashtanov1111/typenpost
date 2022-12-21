import { useLocation, useNavigate, Outlet } from "react-router-dom";
import Col from 'react-bootstrap/Col'
import React from "react";
import Row from 'react-bootstrap/Row'

export function FollowHeader() {
    const navigate = useNavigate()
    const location = useLocation()
    const isFollowers = (location.pathname.endsWith('followers') ||
        location.pathname.endsWith('followers/'))

    return (
        <Row>
            <Col md={6} className='mx-auto'>
                <Row className='text-center follow-header'>
                    <Col
                        onClick={() => navigate('followers')}
                        xs={6}
                        className={
                            (isFollowers ?
                                'follow-tab-selected' :
                                'follow-tab-unselected') + ' follow-tab'}>
                        Followers
                    </Col>
                    <Col
                        onClick={() => navigate('following')}
                        xs={6}
                        className={
                            (!isFollowers ?
                                'follow-tab-selected' :
                                'follow-tab-unselected') + ' follow-tab'}>
                        Following
                    </Col>
                </Row>
                <Outlet />
            </Col>
        </Row>
    )
}

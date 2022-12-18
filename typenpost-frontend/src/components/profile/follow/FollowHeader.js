import React from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export function FollowHeader(props) {
    const navigate = useNavigate()
    const location = useLocation()
    const isFollowers = (location.pathname.endsWith('followers') ||
        location.pathname.endsWith('followers/'))

    return (
        <Row>
            <Col md={10} className='mx-auto'>
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

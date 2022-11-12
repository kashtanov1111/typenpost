import React, {useState, useEffect} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Outlet } from 'react-router-dom';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export function FollowHeader(props) {
    const location = useLocation()
    const [isFollowers, setIsFollowers] = useState(
        location.pathname.endsWith('followers') || 
        location.pathname.endsWith('followers/'))
    const userUsername = getUsernameFromUrl(location.pathname)

    function getUsernameFromUrl(pathname) {
        const theFirstIndexOfSlashInSlicedPathname = 
            pathname.slice(9).indexOf('/')
        return pathname.slice(9, theFirstIndexOfSlashInSlicedPathname + 9)
    }
    useEffect(() => {
        if (location.pathname.endsWith('followers') || 
            location.pathname.endsWith('followers/')){
                setIsFollowers(true)
        } else {
            setIsFollowers(false)
        }
    }, [location.pathname])

    return (
        <Row>
        <Col md={10} className='mx-auto'>
        <Row className='marginx-8px text-center'>
            <Col 
                as={Link} 
                to={'/profile/' + userUsername + '/following' }
                xs={6} 
                className={!isFollowers ? 'active-tab-follow py-2 following-tab' : 'inactive-tab-follow py-2 following-tab '}>
                Following
            </Col>
            <Col 
                as={Link} 
                to={'/profile/' + userUsername + '/followers' }
                xs={6} 
                className={isFollowers ? 'active-tab-follow py-2 followers-tab' : 'inactive-tab-follow py-2 followers-tab '}>
                Followers
            </Col>
        </Row>
        <div className='marginx-8px'>
        <Outlet />
        </div>
        </Col>
        </Row>
    )
}

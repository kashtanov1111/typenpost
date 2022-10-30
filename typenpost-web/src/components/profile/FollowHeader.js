import React, {useState, useEffect} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Outlet } from 'react-router-dom';
import Row from 'react-bootstrap/Row'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'

export function FollowHeader(props) {
    const location = useLocation()
    const [isFollowers, setIsFollowers] = useState(
        location.pathname.endsWith('followers') || 
        location.pathname.endsWith('followers/'))
    const [width, setWidth] = useState(window.innerWidth)
    const navigate = useNavigate()
    const userUsername = getUsernameFromUrl(location.pathname)

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, [window.innerWidth]);

    function getUsernameFromUrl(pathname) {
        const theFirstIndexOfSlashInSlicedPathname = 
            pathname.slice(9).indexOf('/')
        return pathname.slice(9, theFirstIndexOfSlashInSlicedPathname + 9)
    }

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    return (
        <>
        <Tabs
            id="controlled-tab-example"
            as={Row}
            activeKey={isFollowers ? 'followers' : 'following'}
            onSelect={(key) => {
                setIsFollowers(key === 'followers' ? true : false)
                navigate('../profile/' + userUsername + '/' + key)
            }}
            className="mb-3"
            fill={width < 768 ? true : false}
            >
                <Tab className='asdf' onClick={() => console.log('asdfs')} as={Link} to={'profile/' + userUsername + '/following'} eventKey="following" title="Following" >
                </Tab>
            <Tab eventKey="followers" title="Followers">
            </Tab>
        </Tabs>
        <Outlet />
        </>
    )
}

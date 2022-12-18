import nobody from '../../assets/images/nobody.jpg'
import white from '../../assets/images/white.png'
import home from '../../assets/images/home.svg'
import gear from '../../assets/images/gear.svg'
import logout from '../../assets/images/box-arrow-left.svg'
import home_active from '../../assets/images/home_active.svg'
import plus from '../../assets/images/plus-circle.svg'
import plus_fill from '../../assets/images/plus-circle-fill.svg'
import typenpost_on_white from '../../assets/images/typenpost-on-white.svg'
import burger from '../../assets/images/list.svg'
import React, { useState, useContext } from 'react'
import { CustomToggle } from '../../CustomToggle'
import { IsAuthContext, UsernameContext } from '../../context/LoginContext'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown'
import { createImagePlaceholderUrl } from '../../functions/functions'
import ProgressiveImage from 'react-progressive-graceful-image'
import { HeaderLogoutModal } from './HeaderLogoutModal'
import { HeaderSettingsModal } from './HeaderSettingsModal'

export function Header({
    avatar,
    handleLogout,
    handleAlert,
    secondaryEmail
}) {
    const isAuthenticated = useContext(IsAuthContext)
    const navigate = useNavigate()
    const location = useLocation()
    const pathname = location.pathname
    const username = useContext(UsernameContext)
    const [showLogoutModal, setShowLogoutModal] = useState(false)
    const [showSettingsModal, setShowSettingsModal] = useState(false)

    function handleLogoutButtonClicked() {
        setShowLogoutModal(false)
        handleLogout()
        handleAlert('You have signed out.', 'success')
    }

    var src = null
    var placeholderSrc = null
    if (avatar === null) {
        src = white
        placeholderSrc = white
    } else if (avatar === false) {
        src = nobody
        placeholderSrc = nobody
    } else {
        src = avatar
        placeholderSrc = createImagePlaceholderUrl(avatar, '50x50')
    }

    return (isAuthenticated === true ?
        <>  
            <HeaderSettingsModal
                pathname={pathname}
                secondaryEmail={secondaryEmail}
                showSettingsModal={showSettingsModal}
                setShowSettingsModal={setShowSettingsModal}
            />
            <HeaderLogoutModal 
                handleLogoutButtonClicked={handleLogoutButtonClicked}
                showLogoutModal={showLogoutModal}
                setShowLogoutModal={setShowLogoutModal}
            />
            <header className='header-auth'>
                <nav className='header-auth__nav'>
                    <ul className='header-auth__ul'>
                        <li onClick={() => navigate('/')}>
                            <h1 className='header-auth__first-h1'>typenpost</h1>
                            <img className='header-auth__first-image' src={typenpost_on_white} alt="a" height='32' width='32' />
                        </li>
                        <li
                            onClick={() => navigate('/')}>
                            {pathname === '/' ?
                                <img src={home_active} alt="a" height='32' width='32' /> :
                                <img src={home} alt="a" height='32' width='32' />}
                        </li>
                        <li
                            onClick={() => navigate('/create')}>
                            {(pathname === '/create' ||
                                pathname === '/create/') ?
                                <img src={plus_fill} alt="b" height='32' width='32' /> :
                                <img src={plus} alt="b" height='32' width='32' />}
                        </li>
                        <li
                            onClick={() => navigate('/profile/' + username)}>
                            <ProgressiveImage
                                src={src}
                                placeholder={placeholderSrc}>
                                {(src, loading) =>
                                    <img
                                        style={{
                                            filter: loading && 'blur(1px}',
                                            'WebkitFilter': loading && 'blur(1px)'
                                        }}
                                        height='32'
                                        width='32'
                                        className="header-auth__avatar"
                                        src={src}
                                        alt="mdo" />}
                            </ProgressiveImage>
                        </li>
                        <Dropdown>
                            <Dropdown.Toggle
                                as={CustomToggle}
                                id="dropdown-menu-align-responsive-1">
                                <li as={Dropdown}>
                                    <img src={burger} alt="" height='32' width='32' />
                                </li>
                            </Dropdown.Toggle>
                            <Dropdown.Menu className='py-0'>
                                <Dropdown.Item 
                                    onClick={() => setShowSettingsModal(true)}
                                    className='header-auth__dropdown-item py-3'>
                                    <img src={gear} alt="" height='20' width='20' />
                                    <span>Settings</span>
                                </Dropdown.Item>
                                <Dropdown.Divider className='my-0' />
                                <Dropdown.Item
                                    className='header-auth__dropdown-item py-3'
                                    onClick={() => setShowLogoutModal(true)}
                                    >
                                    <img src={logout} alt="" height='20' width='20' />
                                    <span>Log out</span>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </ul>
                </nav>
            </header>
        </>
        :
        <header className='header-unauth'>
            <p className='header-unauth__p'></p>
            <div className='header-unauth__btns'>
                <Button
                    className='header-unauth__btn'
                    as={Link}
                    to='/login'
                    state={pathname}
                    variant='outline-dark'>
                    Log In
                </Button>
                <Button
                    className='header-unauth__btn'
                    as={Link}
                    to='/register'
                    variant='primary'>
                    Sign Up
                </Button>
            </div>
        </header>
    )
}
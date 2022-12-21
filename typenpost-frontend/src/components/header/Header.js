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
import React, { useRef, useState, useContext } from 'react'
import { useOutsideAlerter } from '../../customHooks/useOtsideAlerter'
import { IsAuthContext, UsernameContext } from '../../context/LoginContext'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown'
import ProgressiveImage from 'react-progressive-graceful-image'
import { HeaderLogoutModal } from './HeaderLogoutModal'
import { HeaderSettingsModal } from './HeaderSettingsModal'

import {
    createImageSrcUrl,
    createImagePlaceholderUrl
} from '../../functions/functions'

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
    const [showDropdown, setShowDropdown] = useState(false)
    const dropRef = useRef(null)
    useOutsideAlerter(dropRef, () => setShowDropdown(false))

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
                    <ul className='header-auth__nav__ul'>
                        <li
                            className='header-auth__nav__ul__li-1'
                            onClick={() => navigate('/')}>
                            <h1>typenpost</h1>
                            <img src={createImageSrcUrl(typenpost_on_white)} alt="a" height='32' width='32' />
                        </li>
                        <li
                            className='header-auth__nav__ul__li-2'
                            onClick={() => navigate('/')}>
                            {pathname === '/' ?
                                <img src={createImageSrcUrl(home_active)} alt="a" height='32' width='32' /> :
                                <img src={createImageSrcUrl(home)} alt="a" height='32' width='32' />}
                        </li>
                        <li
                            className='header-auth__nav__ul__li-3'
                            onClick={() => navigate('/create')}>
                            {(pathname === '/create' ||
                                pathname === '/create/') ?
                                <img src={createImageSrcUrl(plus_fill)} alt="b" height='32' width='32' /> :
                                <img src={createImageSrcUrl(plus)} alt="b" height='32' width='32' />}
                        </li>
                        <li
                            className='header-auth__nav__ul__li-4'
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
                                        className="img-shadowed"
                                        src={src}
                                        alt="mdo" />}
                            </ProgressiveImage>
                        </li>
                        <div
                            ref={dropRef}
                            className='header-auth__nav__ul__div c-dropdown'>
                            <li
                                onClick={(e) => {
                                    e.stopPropagation()
                                    console.log('clicked')
                                    setShowDropdown(!showDropdown)
                                }}
                                className='header-auth__nav__ul__div__li-5 pointer'
                                as={Dropdown}>
                                <img
                                    src={createImageSrcUrl(burger)}
                                    alt="" height='32' width='32' />
                            </li>
                            <div className={
                                'c-dropdown__body-auth c-dropdown__body ' +
                                (showDropdown ? 'c-dropdown__body-show' : '')}>
                                <div
                                    className='c-dropdown__el-auth c-dropdown__el pointer'
                                    // className='post-card__dropdown-item py-2'
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setShowDropdown(false)
                                        setShowSettingsModal(true)
                                    }}
                                >
                                    <img
                                        src={createImageSrcUrl(gear)}
                                        alt="" height='20' width='20' />
                                    <span>Settings</span>
                                </div>
                                <div
                                    className='c-dropdown__el c-dropdown__el-auth pointer'
                                    // className='post-card__dropdown-item py-2'
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setShowDropdown(false)
                                        setShowLogoutModal(true)
                                    }}
                                >

                                    <img
                                        src={createImageSrcUrl(logout)}
                                        alt="" height='20' width='20' />
                                    <span>Log out</span>
                                </div>
                            </div>
                        </div>
                    </ul>
                </nav>
            </header>
        </>
        :
        <header className='header-unauth'>
            <p className='header-unauth__p'></p>
            <div className='header-unauth__div'>
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
import React, { useContext } from "react";
import { Link } from 'react-router-dom'
import nobody from '../../assets/images/nobody.jpg'
import Dropdown from 'react-bootstrap/Dropdown'
import { CustomToggle } from '../../CustomToggle'
import ProgressiveImage from 'react-progressive-graceful-image'
import { createImagePlaceholderUrl } from '../../functions/functions'
import { UsernameContext } from "../../context/LoginContext";

export function HeaderDropdown({
    avatar,
    setExpanded,
    handleShowSettingsModal,
    pathname,
    handleShowLogoutModal
}) {
    const username = useContext(UsernameContext)
    return (
        <Dropdown className='mb-lg-0 mb-2'>
            <Dropdown.Toggle
                as={CustomToggle}
                id="dropdown-menu-align-responsive-1">
                <span className="d-block link-dark text-decoration-none 
                dropdown-toggle" >
                    <ProgressiveImage
                        src={avatar ? avatar : nobody}
                        placeholder={avatar ?
                            createImagePlaceholderUrl(avatar, '50x50') : nobody}>
                        {(src, loading) =>
                            <img
                                style={{
                                    filter: loading && 'blur(1px}',
                                    'WebkitFilter': loading && 'blur(1px)'
                                }}
                                height='32'
                                width='32'
                                className="rounded-circle"
                                src={src}
                                alt="mdo" />}
                    </ProgressiveImage>
                </span>
            </Dropdown.Toggle>

            <Dropdown.Menu align={{ lg: 'end' }}>
                <Dropdown.Item
                    as={Link}
                    to={'/profile/' + username}
                    onClick={() => setExpanded(false)}
                    active={pathname === '/profile/' + username}>
                    {username}
                </Dropdown.Item>
                <Dropdown.Item
                    onClick={() => {
                        setExpanded(false)
                        handleShowSettingsModal()
                    }}
                    active={
                        pathname.startsWith('/password_change') ||
                        pathname.startsWith('/username_change')
                    }>
                    Settings
                </Dropdown.Item>
                <Dropdown.Item
                    onClick={() => {
                        setExpanded(false)
                        handleShowLogoutModal()
                    }}>
                    Log out
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}
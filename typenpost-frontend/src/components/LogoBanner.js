import { useLocation } from "react-router-dom"
import arrow from '../assets/images/white-arrow.svg'
import { useNavigate } from "react-router-dom"
import { createImageSrcUrl } from "../functions/functions"

export function LogoBanner({ onClick }) {
    var className = 'logo-banner '
    const navigate = useNavigate()
    const location = useLocation()
    const pathname = location.pathname
    if (
        location.pathname.endsWith('followers') ||
        location.pathname.endsWith('followers/') ||
        location.pathname.endsWith('following') ||
        location.pathname.endsWith('following/')
    ) {
        className = 'offscreen'
    }
    return (pathname !== '/create' &&
        <h1 onClick={onClick} className={className}>
            <img
                className='logo-banner-back'
                onClick={(e) => {
                    e.stopPropagation()
                    navigate(-1)
                }}
                src={createImageSrcUrl(arrow)}
                alt="" width='40' height='40' />
            <span className='name'>typenpost</span>
        </h1>
    )
}
import { useLocation } from "react-router-dom"
import arrow from '../assets/images/white-arrow.svg'
import { useNavigate } from "react-router-dom"

export function LogoBanner() {
    var className = 'logo-banner '
    const navigate = useNavigate()
    const location = useLocation()
    if (
        location.pathname.endsWith('followers') ||
        location.pathname.endsWith('followers/') ||
        location.pathname.endsWith('following') ||
        location.pathname.endsWith('following/')
    ) {
        className = 'offscreen'   
    }
    return (
        <h1 className={className}>
        <img onClick={() => navigate(-1)} src={arrow} alt="" width='40' height='40' />
        <span className='name'>typenpost</span>
        </h1>
    )
}
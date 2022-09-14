import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom'
import Spinner from 'react-bootstrap/Spinner'


export function Logout(props) {
    const {handleLogout, loadingDeleteToken, handleAlert} = props
    const navigate = useNavigate()

    function handleButtonClick() {
        handleLogout()
        handleAlert('You have signed out.', 'success')
        navigate('../', {replace: true})
    }
    return (
        <Row>
            <Col md={6} className='mx-auto text-center'>
                <h1>Log Out</h1>
                <p>Are you sure want to log out?</p>
                <Button 
                    onClick={handleButtonClick} 
                    variant='warning'>
                    Log Out
                    </Button>
            </Col>
        </Row>
    )
}
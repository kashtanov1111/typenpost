import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export function Error() {
    return (
        <Row>
            <Col md={6} className='mx-auto text-center'>
                <h1>Error</h1>
                <p>An error occured, please try again later.</p>
            </Col>
        </Row>
    )
}
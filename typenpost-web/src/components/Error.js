import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export function Error(props) {
    const {description} = props
    const final_description = (description ? description :
         'An error occured, please try again later.')
    return (
        <Row>
            <Col md={6} className='mx-auto text-center'>
                <h1>Error</h1>
                <p>{final_description}</p>
            </Col>
        </Row>
    )
}
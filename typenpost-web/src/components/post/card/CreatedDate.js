import Col from 'react-bootstrap/Col'
import {format, parseISO } from 'date-fns'

export function CreatedDate(props) {
    const {created, yearNow} = props
    const createdDateYear = parseInt(format(parseISO(created), 
        'yyyy'))
    var createdDate = ''
    if (createdDateYear < yearNow) {
        createdDate = format(parseISO(created), 
        'MMM d, yyyy')
        return (
            <Col xs={5} className='text-center px-1'>
                <p className='mb-0'>
                · {createdDate}
                            </p>
                </Col>
        )
    } else {
        createdDate = format(parseISO(created), 
        'MMM d')
        return (
            <Col xs={3} className='text-center px-1'>
                <p className='mb-0'>
                · {createdDate}
                            </p>
                </Col>
        )
    }
}
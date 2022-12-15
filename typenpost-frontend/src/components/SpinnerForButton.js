import Spinner from 'react-bootstrap/Spinner'

export function SpinnerForButton() {
    return (
        <div>
            <Spinner
                as='span'
                animation='border'
                size='sm'
                role='status'
                aria-hidden='true' />
            <span className='visually-hidden'>Loading...</span>
        </div>
    )
}
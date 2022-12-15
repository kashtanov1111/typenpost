export function Error(props) {
    const { description } = props
    const final_description = (description ? description :
        'An error occured, please try again later.')
    return (
        <div className='error'>
            <h1>Error</h1>
            <p>{final_description}</p>
        </div>
    )
}
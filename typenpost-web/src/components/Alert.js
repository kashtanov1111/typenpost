
export function Alert(props) {
    const {text, style, show} = props
    const newStyle = style ? style : 'primary'
    const className = "alert alert-" + newStyle
    return (<div className='container'>
        {show ?
        <div className={className} role="alert">
            {text}
        </div> :
        <></>}
        </div>
    )
}
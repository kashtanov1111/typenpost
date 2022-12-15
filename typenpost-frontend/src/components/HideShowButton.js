export function HideShowButton({
    handleShowPassword,
    showPassword,
    password,
    showValidation
}) {
    if (password === '') {
        return <></>
    }
    var className = 'show-password-btn pointer'
    if (showValidation) {
        className = className + ' show-password-btn-shifted' 
    }
    return (
        <b
            className={className}
            onClick={handleShowPassword} >
            {showPassword ? 'Hide' : 'Show'}
        </b>
    )
}
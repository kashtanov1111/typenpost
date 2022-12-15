export function LogoBanner({extraClass}) {
    var className = 'logo-for-forms '
    if (extraClass) {
        className = className + extraClass          
    }
    return (
        <h1 className={className}><span>typenpost</span></h1>
    )
}
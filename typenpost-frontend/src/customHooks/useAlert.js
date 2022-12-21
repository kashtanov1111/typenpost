import { useState } from "react"

export function useAlert() {
    const [showAlert, setShowAlert] = useState(false)
    const [textAlert, setTextAlert] = useState('')
    const [styleAlert, setStyleAlert] = useState('')

    function handleAlert(text, style) {
        setTextAlert(text)
        setStyleAlert(style)
        setShowAlert(true)
        setTimeout(() => {
            setShowAlert(false)
        }, 5000);
    }

    return {
        showAlert: showAlert,
        textAlert: textAlert,
        styleAlert: styleAlert,
        handleAlert: handleAlert
    }
}
import React, {useContext} from "react"
import { useMutation } from "@apollo/client"
import { useParams, useNavigate } from "react-router-dom"
import { useTitle } from  '../../customHooks/hooks'

import { Error } from "../Error"

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import { VERIFY_ACCOUNT, VERIFY_SECONDARY_EMAIL } from "../../gqls/mutations"
import { UsernameContext } from "../../context/LoginContext"
export function VerifyAccount(props) {
    const {handleAlert, verified} = props
    const username = useContext(UsernameContext)
    const params = useParams()
    const token = params.confirmationToken
    const navigate = useNavigate()
    useTitle('Typenpost - Verify Account')
    
    const [verifyAccount, 
        { error: errorVerifyAccount }] = useMutation(VERIFY_ACCOUNT, {
        variables: { token: token },
        onCompleted: (data) => {
            if (data.verifyAccount.success) {
                handleAlert('Your account has been verified.', 'success')
                navigate('../login', {replace: true})
            }
        }
    })

    const [verifySecondaryEmail, { error: errorVerifySecondaryEmail }] = 
        useMutation(VERIFY_SECONDARY_EMAIL, {
        variables: { token: token },
        onCompleted: (data) => {
            if (data.verifySecondaryEmail.success) {
                handleAlert('Your email has been verified.', 'success')
                navigate('../profile/' + username, {replace: true})
            }
        }
    })

    function handleClickBtn() {
        if (verified) {
            verifySecondaryEmail()
        } else {
            verifyAccount()
        }
    }

    if (errorVerifyAccount ||
        errorVerifySecondaryEmail) {
        return <Error />
    }

    return (
        // <div className='centered'>
        <Row className=''>
            <Col md={6} className='my-auto mx-auto text-center'>
                <h1>Confirm E-mail Address</h1>
                <p>Please confirm that this is your email address.</p>
                <Button variant='success' onClick={handleClickBtn}>
                    Confirm
                </Button>
            </Col>
        </Row>
        // </div>
    )
}

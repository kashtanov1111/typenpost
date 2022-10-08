import React from "react"
import { useMutation } from "@apollo/client"
import { useParams, useNavigate } from "react-router-dom"
import { useTitle } from "../../functions/functions"

import { Error } from "../Error"

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import { VERIFY_ACCOUNT } from "../../gqls/mutations"

export function VerifyAccount(props) {
    const {handleAlert, isAuthenticated} = props
    const params = useParams()
    const token = params.confirmationToken
    const navigate = useNavigate()
    useTitle('Typenpost - Verify Account')
    
    const [verifyAccount, { error }] = useMutation(VERIFY_ACCOUNT, {
        variables: { token: token },
        onCompleted: (data) => {
            if (data.verifyAccount.success) {
                handleAlert('Your account has been verified.', 'success')
                navigate('../login', {replace: true})
            }
        }
    })

    if (error) {
        return <Error />
    }

    return (!isAuthenticated ?
        <div className='centered'>
        <Row className=''>
            <Col md={6} className='my-auto mx-auto text-center'>
                <h1>Confirm E-mail Address</h1>
                <p>Please confirm that this is your email address.</p>
                <Button variant='success' onClick={verifyAccount}>
                    Verify Account
                </Button>
            </Col>
        </Row></div>:
        <Error description='You are logged in. Please log out.' />
    )
}

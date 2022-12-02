import React from "react";
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { SpinnerForButton } from "../SpinnerForButton";
import { RESEND_ACTIVATION_EMAIL } from "../../gqls/mutations";
import { useMutation } from "@apollo/client";
import { Error } from "../Error";

export function RegisterMade({
    formState,
    handleAlert,
}) {
    const [handleResend, { loading, error }] = useMutation(
        RESEND_ACTIVATION_EMAIL, {
        variables: {
            email: formState.email
        },
        onCompleted: (data) => {
            if (data.resendActivationEmail.success) {
                const message =
                    'Confirmation e-mail has been resent to ' +
                    formState.email
                handleAlert(message, 'primary')
            }
        }
    }
    )

    if (error) {
        return <Error />
    }

    return (
        <Row>
            <Col md={8} className='mx-auto'>
                <h1 className='mt-2 mb-2'>Verify Your E-mail Address</h1>
                <p>We have sent an e-mail to you for verification.
                    Follow the link provided to finalize the signup process.
                    If you do not see the verification e-mail in your main inbox,
                    check your spam folder. Please contact us
                    if you do not receive the verification e-mail within
                    a few minutes.</p>
                <Row>
                    <Col xs={12}>
                        Is Confirmation email not coming?
                    </Col>
                    <Col xs={12} className='my-2'>
                        <Button
                            onClick={handleResend}
                            variant='primary'
                        >
                            {loading ?
                                <SpinnerForButton /> :
                                <span>Resend</span>
                            }
                        </Button>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}
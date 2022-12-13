// import React, { useContext } from "react"
// import { useMutation } from "@apollo/client"
// import { useParams, useNavigate } from "react-router-dom"
// import { useTitle } from '../../customHooks/hooks'

// import { Error } from "../Error"

// import Row from 'react-bootstrap/Row'
// import Col from 'react-bootstrap/Col'
// import Button from 'react-bootstrap/Button'
// import { Loader } from "../Loader"
// import { VERIFY_SECONDARY_EMAIL } from "../../gqls/mutations"
// import { IsAuthContext } from "../../context/LoginContext"
// import { SpinnerForButton } from "../SpinnerForButton"

// export function VerifySecondaryEmail({ handleAlert, queryMe }) {
//     const isAuthenticated = useContext(IsAuthContext)
//     const params = useParams()
//     const token = params.confirmationToken
//     const navigate = useNavigate()
//     useTitle('Typenpost - Verify Account')

//     const [verifySecondaryEmail, { loading, error }] = useMutation(VERIFY_SECONDARY_EMAIL, {
//         variables: { token: token },
//         onCompleted: (data) => {
//             if (data.verifySecondaryEmail.success) {
//                 handleAlert('Your email has been verified.', 'success')
//                 navigate('../', { replace: true })
//                 if (isAuthenticated === true) {
//                     queryMe()
//                 }
//             }
//         }
//     })

//     if (error) {
//         return <Error />
//     }

//     if (isAuthenticated === null) {
//         return <Loader />
//     }

//     return (
//         <Row >
//             <Col md={6} className='my-auto mx-auto'>
//                 <h1 className='my-2'>Confirm E-mail Address</h1>
//                 <p>Please confirm that this is your email address.</p>
//                 <Button
//                     className='mb-3'
//                     variant='success'
//                     onClick={verifySecondaryEmail}>
//                     {loading ?
//                         <SpinnerForButton /> :
//                         <>Confirm</>}
//                 </Button>
//             </Col>
//         </Row>
//     )
// }

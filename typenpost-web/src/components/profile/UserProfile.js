import React, {useState, useEffect} from "react";
import { useTitle } from "../../functions/functions";
import { useParams } from "react-router-dom";
import { USER_PROFILE } from "../../gqls/queries";
import { Error } from "../Error";
import ProgressiveImage from 'react-progressive-graceful-image'
import { useQuery } from "@apollo/client";
import { Loader } from "../Loader";

import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

export function UserProfile(props) {
    const params = useParams()
    const userId = params.userId
    const [title, setTitle] = useState('Typenpost')
    const {username} = props
    const { data, loading, error } = useQuery(USER_PROFILE, {
            variables: { id: userId },
            polling: 500,
            onCompleted: (data) => {
                const newTitle = ((username === data.user.username) ? 
                    'Typenpost - My profile' : 
                    'Typenpost - ' + data.user.username)
                setTitle(newTitle)
                }
    })
    useTitle(title)
    if (loading) {
        return <Loader />
    }
    if (error) {
        return <Error />
    }
    return (
        <Card>
        {/* <Card.Img variant="top" src="holder.js/100px180" />
        <Card.Body>
            <Card.Title>Card Title</Card.Title>
            <Card.Text>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
            </Card.Text>
            <Button variant="primary">Go somewhere</Button>
        </Card.Body> */}
        <h1>sdfg</h1>
        </Card>
    )
}
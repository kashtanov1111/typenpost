import React from 'react'
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { useQuery } from '@apollo/client';
import { USER_SEARCH_INITIAL } from '../../gqls/queries';
import { Button, Col, InputGroup, Row, Spinner } from 'react-bootstrap';
import { AiOutlineSearch } from 'react-icons/ai'
import './search.css';
import ProgressiveImage from 'react-progressive-graceful-image'
import { createImagePlaceholderUrl } from '../../functions/functions';
import nobody from '../../assets/images/nobody.jpg'
import { Link } from 'react-router-dom';
import { debounce } from "lodash";
import ShowMoreData from './ShowMoreData';
import { Waypoint } from 'react-waypoint';
import { Error } from '../Error';


const Search = () => {
    const [search, setSearch] = React.useState('')
    const [showMore, setShowMore] = React.useState(true)

    const { data,
        loading,
        error } = useQuery(USER_SEARCH_INITIAL, {
            variables: { search: search }
        })


    const debouncedGetUser = debounce(query => {
        setSearch(query);
    }, 500);

    const handleChange = (e) => {
        debouncedGetUser(e.target.value)
        setShowMore(true)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setShowMore(false)
    }

    if (error) {
        return <Error />
    }


    return (
        <>
            <Container fluid className='d-flex justify-content-center flex-column ' >
                <Form className="d-flex flex-column justify-content-center">
                    <InputGroup className="mb-2 search_input_group" >
                        <InputGroup.Text>
                            <AiOutlineSearch />
                        </InputGroup.Text>
                        <Form.Control
                            className="shadow-none"
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                            onChange={handleChange}
                            onKeyPress={(e) => { e.key === 'Enter' && handleSubmit(e) }}
                        />
                    </InputGroup>
                    <div style={{ background: '#F5F5F5', borderRadius: '10px' }}>
                        {loading && <Spinner style={{ position: "relative", left: '50%' }} animation="border" />}
                        {showMore && (<div className="d-flex flex-column justify-content-center searchResult">
                            {(search && data) && data?.userSearch?.edges.map((value) => {
                                const { avatar } = value.node.profile;
                                return (
                                    <Link key={value.node.id} to={`/profile/${value?.node?.username}`} className="link">
                                        <div className="p-3 search_data" >
                                            <ProgressiveImage
                                                src={avatar ?
                                                    avatar : nobody}
                                                placeholder={avatar ?
                                                    createImagePlaceholderUrl(
                                                        avatar, '30x30') : nobody}
                                            >
                                                {(src, loading) =>
                                                    <img
                                                        style={{
                                                            filter: loading && 'blur(1px}',
                                                            'WebkitFilter': loading && 'blur(1px)'
                                                        }}
                                                        width='34'
                                                        height='64'
                                                        className='img-shadowed'
                                                        src={src}
                                                        alt="avatar" />}
                                            </ProgressiveImage>
                                            <div className='flex-column'>
                                                <p >{value?.node?.username}</p>
                                                <p >Name</p>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                            {search && data?.userSearch?.edges.length > 0 && <p onClick={(e) => handleSubmit(e)} className='text-center search_showMore'>show more</p>}
                        </div>)}
                    </div>
                </Form>
            </Container>
            <div>
                <ShowMoreData
                    search={search}
                    showMore={showMore}
                    nobody={nobody}
                />
            </div>
        </>
    );
}

export default Search
import long_logo from '../assets/images/long_logo.jpg'
import nobody from '../assets/images/nobody.jpg'
import theshot from '../assets/images/theshot.jpg'

import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import { IsAuthContext, UsernameContext } from '../context/LoginContext'
import { Loader } from './Loader'
export function TestTest({ handleLogout }) {
    const [count, setCount] = useState(0)
    const isAuthenticated = useContext(IsAuthContext)
    const username = useContext(UsernameContext)

    return (
        // <Loader />
        <>
            <h1>typenpost</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus reiciendis quos impedit at velit optio in eius quaerat atque numquam nam dolor pariatur veritatis accusantium autem voluptatibus porro voluptas eligendi obcaecati illo et, officia sapiente. Debitis voluptate impedit, officiis minima rem corrupti qui temporibus suscipit ipsam voluptatibus. Nihil consequuntur sint fugiat, earum fuga excepturi vel est ad, labore nam aut dignissimos perferendis totam placeat maiores eveniet aspernatur cumque cupiditate unde repellat beatae. Suscipit vel placeat cumque praesentium officia laborum ipsam quas aperiam amet, a animi quasi. Illo ipsa, eius doloremque fuga sit veritatis, dolorem vitae fugit animi provident illum nobis perspiciatis harum nemo alias minima dignissimos ipsum ducimus? Vel deserunt, exercitationem eligendi inventore velit distinctio nam placeat cumque. Dolore vitae hic similique, odio ratione nulla temporibus alias qui consequatur eum saepe ullam commodi architecto facere eaque. Veniam beatae omnis laudantium sed. Nemo laborum eaque minima, consectetur doloremque illum saepe debitis facere dolore ipsum esse placeat assumenda consequuntur quae mollitia ullam, porro cum iure minus nesciunt molestiae tempora quas. Nulla et minima hic, quis praesentium reiciendis modi dolores recusandae fugit sunt veritatis, officia amet dolorem qui, adipisci laboriosam libero voluptates quaerat consequatur ipsa quas totam. Magni, odio eius consequuntur deleniti, inventore dolorum tenetur mollitia earum, quo accusamus alias sequi delectus. In impedit et molestias molestiae nostrum delectus cupiditate laborum nisi sunt dicta libero non aliquid optio animi unde, quae temporibus repudiandae, facere eius cum doloribus voluptatum. Reiciendis blanditiis dolore dignissimos totam ex rerum! Deserunt praesentium maxime commodi? Aperiam pariatur dicta ab tempora repellendus rem ipsa facere, veniam, sed nostrum officiis beatae ullam. Earum a mollitia ex alias eum debitis officia assumenda dicta nam, atque commodi eius optio! Rerum quia fuga nostrum placeat doloribus nam itaque, minima ea repellendus accusantium! Aut repudiandae velit omnis enim error quae. Placeat quidem nam in cumque aliquid. Aliquam quaerat architecto incidunt quod fugit! Sint adipisci rerum quod hic velit, cumque porro consectetur ullam doloremque voluptatum harum. Sint ratione quod rem facilis molestias eos blanditiis fuga quae amet, consequatur necessitatibus nulla accusamus deleniti id dolor perspiciatis voluptate aliquid dignissimos iste quas assumenda consequuntur? Debitis et illum aliquid vero magni non explicabo earum officiis, iusto beatae totam quae! Voluptates hic natus repellendus facilis reprehenderit aliquam libero similique adipisci nobis cum tenetur minus, officia, asperiores est ratione? Ad assumenda quidem fuga provident distinctio tempora voluptas voluptatibus laudantium nobis, natus praesentium iusto, neque quas minima maxime aliquam doloremque temporibus illum repudiandae accusamus laboriosam nesciunt amet vitae quis? Ea omnis animi nesciunt, in quidem magnam quam quisquam necessitatibus commodi neque eaque ullam a deleniti optio quia ipsam. Suscipit, reprehenderit. Officiis ut fugit quas cum maiores. Sunt adipisci magni illum temporibus modi quibusdam ex ut explicabo ea, non ducimus cupiditate ipsam, omnis eaque dolorum? Soluta mollitia, optio corrupti repudiandae eius recusandae! Libero dolores reprehenderit ipsa id officia esse blanditiis, placeat autem consequuntur nostrum explicabo, asperiores doloremque totam itaque aliquam animi molestias culpa voluptatum possimus quis magni laborum. Dolores dignissimos temporibus vitae repellendus laudantium perspiciatis quas consectetur nesciunt porro nobis? Nulla, odit reiciendis!</p>
            <button
                as={Link}
                to='/login'
                variant='outline-dark'
                className="me-2">
                Log In
            </button>
            <button
                onClick={() => handleLogout()}
                variant='outline-dark'
                className="me-2">
                Log out
            </button>
            <button onClick={() => {
                return setCount(count + 1)
            }}>{count}</button>
            <Button>asdf</Button>
        </>
    )
}
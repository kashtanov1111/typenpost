import InfiniteScroll from "react-infinite-scroll-component"
import { SpinnerForPages } from "../SpinnerForPages"
import Spinner from "react-bootstrap/Spinner"
import { CommentCard } from "./card/CommentCard"

export function PostComments({
    fetchMore,
    data,
    postUUID,
    postId,
    authUsername,
    handleAlert
}) {

    return (
        <div className={data && data.post.comments.edges.length > 0 ? 'mb-4-5' : 'mt-4-5'}>
            <InfiniteScroll
                dataLength={data ? data.post.comments.edges.length : 1}
                next={() => fetchMore({
                    variables: {
                        uuid: postUUID,
                        cursor: data.post.comments.pageInfo.endCursor,
                    },
                })}
                hasMore={data && data.post.comments.pageInfo.hasNextPage}
                loader={<div className='text-center my-3'>
                    <Spinner variant='primary' animation='border' />
                </div>}
                style={{ overflow: 'visible' }}
            >
                {data ? data.post.comments.edges.map((el) => (
                    el.node &&
                    <CommentCard
                        key={el.node.id}
                        comment={el.node}
                        postId={postId}
                        authUsername={authUsername}
                        handleAlert={handleAlert}
                        mainComment={true}
                    />
                )) : <SpinnerForPages />}
            </InfiniteScroll>
        </div>
    )
}
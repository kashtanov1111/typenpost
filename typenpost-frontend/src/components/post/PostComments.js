import { CommentCard } from "./card/CommentCard"
import { CommentCreate } from './CommentCreate';
import { SpinnerForPages } from "../SpinnerForPages"
import { useState } from "react";
import { useWindowWidth } from '../../customHooks/useWindowWidth';
import InfiniteScroll from "react-infinite-scroll-component"
import Spinner from "react-bootstrap/Spinner"

export function PostComments({
    authUsername,
    autoFocusShow,
    data,
    loadingComments,
    fetchMore,
    handleAlert,
    handleShowAutoFocus,
    post,
    postId,
    postUUID,
    refetchPostComments,
    setAutoFocusShow,
    setPost,
}) {
    const [commentUserUsername, setCommentUserUsername] = useState(null)
    const [commentUUID, setCommentUUID] = useState(null)
    const [
        refetchRepliesOfCommentUUID, 
        setRefetchRepliesOfCommentUUID] = useState(false)
    
    const windowWidth = useWindowWidth()
    const isMobileScreen = windowWidth < 576

    function handleReplyOnCommentCreation() {
        setRefetchRepliesOfCommentUUID(commentUUID)        
    }
    
    return (
        <>
            {!isMobileScreen && authUsername && <CommentCreate
                autoFocusShow={autoFocusShow}
                setAutoFocusShow={setAutoFocusShow}
                handleAlert={handleAlert}
                handleReplyOnCommentCreation={handleReplyOnCommentCreation}
                postUUID={postUUID}
                refetchPostComments={refetchPostComments}
                setPost={setPost}
                post={post}
                commentUUID={commentUUID}
                commentUserUsername={commentUserUsername}
                setCommentUUID={setCommentUUID}
                setCommentUserUsername={setCommentUserUsername}
                notMobile={true}
            />}
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
                    {data && data.post.comments.edges.map((el) => (
                        el.node &&
                        <CommentCard
                            authUsername={authUsername}
                            comment={el.node}
                            handleAlert={handleAlert}
                            handleShowAutoFocus={handleShowAutoFocus}
                            key={el.node.id}
                            mainComment={true}
                            post={post}
                            postId={postId}
                            setCommentUserUsername={setCommentUserUsername}
                            setCommentUUID={setCommentUUID}
                            setPost={setPost}
                            refetchRepliesOfCommentUUID={refetchRepliesOfCommentUUID}
                        />
                    ))}
                    {loadingComments && <SpinnerForPages />}
                </InfiniteScroll>
            </div>
            {isMobileScreen && authUsername && <CommentCreate
                autoFocusShow={autoFocusShow}
                setAutoFocusShow={setAutoFocusShow}
                handleAlert={handleAlert}
                handleReplyOnCommentCreation={handleReplyOnCommentCreation}
                postUUID={postUUID}
                refetchPostComments={refetchPostComments}
                setPost={setPost}
                commentUUID={commentUUID}
                commentUserUsername={commentUserUsername}
                setCommentUUID={setCommentUUID}
                setCommentUserUsername={setCommentUserUsername}
                post={post} />}
        </>
    )
}
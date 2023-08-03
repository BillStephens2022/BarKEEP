import React from "react";
import { useQuery } from "@apollo/client";
import { Modal, Button } from "react-bootstrap";
import { GET_POST_LIKES_USERS, GET_SINGLE_POST } from "../utils/queries";
import ProfilePhoto from "./ProfilePhoto";
import SinglePost from "./SinglePost";
import "../styles/PostLikesModal.css";

const PostLikesModal = ({ postId, onClose }) => {
  const { loading, data } = useQuery(GET_POST_LIKES_USERS, {
    variables: { postId },
  });

  // Fetch the post details using another query
  const { loading: postLoading, data: postData } = useQuery(GET_SINGLE_POST, {
    variables: { postId },
  });

  const post = postData?.getSinglePost;

  return (
    <Modal className="post-likes-modal" show={true} onHide={onClose}>
      <Modal.Header className="post-likes-modal-header">
        <Modal.Title className="post-likes-modal-title">Liked by:</Modal.Title>
        <button
          type="button"
          className="post-likes-modal-btn-close"
          aria-label="Close"
          onClick={onClose}
        >x</button>
      </Modal.Header>
      <Modal.Body>
        {loading || postLoading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <ul className="post-likes-modal-ul">
              {data?.postLikesUsers?.map((like) => (
                <li className="post-likes-modal-li" key={like._id}>
                  <ProfilePhoto
                    imageUrl={
                      like.profilePhoto ||
                      "https://helloartsy.com/wp-content/uploads/kids/food/how-to-draw-a-martini-glass/how-to-draw-a-martini-glass-step-6.jpg"
                    }
                    size={64}
                  />
                  {like.username}
                </li>
              ))}
            </ul>
            <h3 className="post-likes-modal-subtitle">Post:</h3>
            {post && <SinglePost postId={postId} />}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="post-likes-modal-footer">
        <Button onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PostLikesModal;

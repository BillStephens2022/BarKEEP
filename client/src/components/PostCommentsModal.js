import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Modal, Button } from "react-bootstrap";
import { BiSolidSend } from "react-icons/bi";
import { GET_SINGLE_POST } from "../utils/queries";
import ProfilePhoto from "./ProfilePhoto";
import SinglePost from "./SinglePost";
import "../styles/PostCommentsModal.css";

const PostCommentsModal = ({ postId, onClose, addComment }) => {
  // State to hold the comment input
  const [commentInput, setCommentInput] = useState(""); 
  const { loading: postLoading, data: postData } = useQuery(GET_SINGLE_POST, {
    variables: { postId },
  });

  const post = postData?.getSinglePost;

  const handleAddComment = async () => {
    if (commentInput.trim() !== "") {
      try {
        await addComment({
          variables: {
            postId: postId,
            text: commentInput,
          },
        });
        // Clear the comment input after adding
        setCommentInput("");
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  return (
    <Modal className="post-comments-modal" show={true} onHide={onClose}>
      <Modal.Header className="post-comments-modal-header">
        <Modal.Title className="post-comments-modal-title">
          COMMENTS:
        </Modal.Title>
        <button
          type="button"
          className="post-comments-modal-btn-close"
          aria-label="Close"
          onClick={onClose}
        >
          x
        </button>
      </Modal.Header>
      <Modal.Body>
        {postLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="post-modal-comments-section">
            {post && <SinglePost postId={postId} />}
            <ul className="post-comments-modal-ul">
              {post.comments?.map((comment) => (
                <li className="post-comments-modal-li" key={comment._id}>
                  <div className="comment-header">
                    <ProfilePhoto
                      imageUrl={
                        comment.author.profilePhoto ||
                        "https://helloartsy.com/wp-content/uploads/kids/food/how-to-draw-a-martini-glass/how-to-draw-a-martini-glass-step-6.jpg"
                      }
                      size={48}
                    />
                    {comment.author.username}
                  </div>
                  <p className="post-comments-modal-p">{comment.text}</p>
                </li>
              ))}
            </ul>
            <div className="comment-input-container">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentInput}
                className="comment-text-input"
                onChange={(e) => setCommentInput(e.target.value)}
              />
              <button className="btn btn-submit-comment" onClick={handleAddComment}><BiSolidSend /></button>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="post-comments-modal-footer">
        <Button onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PostCommentsModal;

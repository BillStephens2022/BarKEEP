import React from 'react';
import { useQuery } from '@apollo/client';
import { Modal, Button } from 'react-bootstrap'; 
import { GET_POST_LIKES_USERS, GET_SINGLE_POST } from '../utils/queries'; 
import ProfilePhoto from './ProfilePhoto';
import SinglePost from './SinglePost';
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
    
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Liked by:</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading || postLoading ? (
          <p>Loading...</p>
        ) : (
            <div>
            {post && (
              
                <SinglePost postId={postId} />
                
            
            )}
            <h3>Liked by:</h3>
            <ul>
              {data?.postLikesUsers?.map((like) => (
                <li key={like._id}>
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
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PostLikesModal;
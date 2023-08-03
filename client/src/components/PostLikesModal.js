import React from 'react';
import { useQuery } from '@apollo/client';
import { Modal, Button } from 'react-bootstrap'; 
import { GET_POST_LIKES_USERS } from '../utils/queries'; 

const PostLikesModal = ({ postId, onClose }) => {
  const { loading, data } = useQuery(GET_POST_LIKES_USERS, {
    variables: { postId },
  });

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Liked by:</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {data?.postLikesUsers?.map((user) => (
              <li key={user._id}>
                <img src={user.profilePhoto} alt={`${user.username}'s profile`} />
                {user.username}
              </li>
            ))}
          </ul>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PostLikesModal;
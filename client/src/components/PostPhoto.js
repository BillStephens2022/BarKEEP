import React, { useState } from "react";
import cloudinary from "cloudinary-core";
import { Modal } from "react-bootstrap";
import "../styles/PostPhoto.css";

const cloudinaryCore = new cloudinary.Cloudinary({
  cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
});

const PostPhoto = ({ imageUrl }) => {
  const transformedImageUrl = cloudinaryCore.url(imageUrl, {
    width: 500,
    height: 500,
    crop: "fill_pad",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <>
      <img
        className="post-photo"
        src={transformedImageUrl}
        alt="post"
        onClick={handleToggleModal}
      />

      <Modal show={isModalOpen} onHide={handleToggleModal} centered>
        <Modal.Body>
          <img
            className="modal-photo"
            src={transformedImageUrl}
            alt="post"
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PostPhoto;

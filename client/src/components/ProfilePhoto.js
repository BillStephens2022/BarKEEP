import React, { useState } from "react";
import cloudinary from "cloudinary-core";
import { Modal } from "react-bootstrap";

// Initialize Cloudinary
const cloudinaryCore = new cloudinary.Cloudinary({
  cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
});

const ProfilePhoto = ({ imageUrl, size, customClass }) => {

  // To manage the modal's open/close state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to toggle the modal's state
  const handleToggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };
  
  // Transform the image URL using Cloudinary
  const transformedImageUrl = cloudinaryCore.url(imageUrl, {
    width: size,
    height: size,
    crop: "fill",
    radius: "max",
  });

  return (
    <>
      {/* Profile photo thumbnail */}
      <img
        className={`profile-photo post-author-image size-${size} ${customClass}`}
        src={transformedImageUrl}
        onClick={handleToggleModal}
        alt="Profile"
      />

      {/* Modal for displaying the enlarged profile photo */}
      <Modal
        show={isModalOpen}
        onHide={handleToggleModal}
        centered
        animation={true}
      >
        <Modal.Body>
          <img
            className="modal-profile-photo"
            src={transformedImageUrl}
            alt="user profile"
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProfilePhoto;

import React, { useState } from "react";
import cloudinary from "cloudinary-core";
import { Modal } from "react-bootstrap";
import "../styles/components/PostPhoto.css";

// Initialize Cloudinary
const cloudinaryCore = new cloudinary.Cloudinary({
  cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
});

// When photo is clicked on, modal will display showing enlarged photo
const PostPhoto = ({ imageUrl, page }) => {
  // Initialize transformed image URL to the provided imageUrl
  let transformedImageUrl = imageUrl;
  // Check if the page is not "about", then transform the image using Cloudinary (since the user doesn't need
  // to be logged in to view the "About" page, no need and will not be able to display the profile photo in the header)
  if (page !== "about") {
   transformedImageUrl = cloudinaryCore.url(imageUrl, {
    width: 500,
    height: 500,
    crop: "fill_pad",
  });
}
  // To manage the modal's open/close state
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Function to toggle the modal's state
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
      {/* Modal for displaying the enlarged photo */}
      <Modal
        show={isModalOpen}
        onHide={handleToggleModal}
        centered
        animation={true}
      >
        <Modal.Body>
          <img className="modal-photo" src={transformedImageUrl} alt="post" />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PostPhoto;

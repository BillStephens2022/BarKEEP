import React, { useState } from "react";
import cloudinary from "cloudinary-core";
import { Modal } from "react-bootstrap";

const cloudinaryCore = new cloudinary.Cloudinary({ cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME });

const ProfilePhoto = ({ imageUrl, size }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleToggleModal = () => {
      setIsModalOpen((prev) => !prev);
    };

    const transformedImageUrl = cloudinaryCore.url(imageUrl, {
      width: size,
      height: size,
      crop: "fill",
      radius: "max",
    });
  
    return (
      <>
      <img className={`profile-photo post-author-image size-${size}`} src={transformedImageUrl} onClick={handleToggleModal} alt="Profile" />
      <Modal
        show={isModalOpen}
        onHide={handleToggleModal}
        centered
        animation={true}
      >
        <Modal.Body>
          <img className="modal-profile-photo" src={transformedImageUrl} alt="user profile" />
        </Modal.Body>
      </Modal>
      </>
    );
  };

export default ProfilePhoto;

import React from "react";
import cloudinary from "cloudinary-core";

const cloudinaryCore = new cloudinary.Cloudinary({ cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME });

const ProfilePhoto = ({ imageUrl, size }) => {
    const transformedImageUrl = cloudinaryCore.url(imageUrl, {
      width: size,
      height: size,
      crop: "fill",
      radius: "max",
    });
  
    return (
      <img className={`profile-photo post-author-image size-${size}`} src={transformedImageUrl} alt="Profile" />
    );
  };

export default ProfilePhoto;

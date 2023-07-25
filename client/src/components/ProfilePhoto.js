import React from "react";
import cloudinary from "cloudinary-core";

const cloudinaryCore = new cloudinary.Cloudinary({ cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME });

const ProfilePhoto = ({ imageUrl }) => {
    const transformedImageUrl = cloudinaryCore.url(imageUrl, {
      width: 200,
      height: 200,
      crop: "fill",
      radius: "max",
    });
  
    return (
      <img className="post-author-image" src={transformedImageUrl} alt="Profile" />
    );
  };

export default ProfilePhoto;

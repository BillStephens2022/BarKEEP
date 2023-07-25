import React from "react";
import cloudinary from "cloudinary-core";

const cloudinaryCore = new cloudinary.Cloudinary({ cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME });

const PostPhoto = ({ imageUrl }) => {
    const transformedImageUrl = cloudinaryCore.url(imageUrl, {
      width: 500,
      height: 500,
      crop: "fill_pad",
    });
  
    return (
      <img className={"post-photo"} src={transformedImageUrl} alt="post" />
    );
  };

export default PostPhoto;
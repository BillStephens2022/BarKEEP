import React, { useState } from "react";
import { CloudinaryContext, Image, Transformation } from "cloudinary-react";
import moment from "moment-timezone";
// import axios from "axios";
import { useMutation } from "@apollo/client";
import { UPLOAD_POST_IMAGE } from "../utils/mutations";
import "../styles/PostForm.css";

const initialState = {
  postTitle: "",
  postContent: "",
  postImageURL: "",
};

const PostForm = ({
  addPost,
  postFormState,
  setPostFormState,
  setShowPostForm,
  currentUser,
}) => {
  const [imageUploadUrl, setImageUploadUrl] = useState("");
  const [uploadPostImage] = useMutation(UPLOAD_POST_IMAGE);
  const cloudinaryCloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  console.log("HELLO:", cloudinaryCloudName);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { postTitle, postContent } = postFormState;
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const postDate = moment().tz(userTimeZone).toDate();

    // Check if any required fields are empty
    if (!postTitle || !postContent) {
      console.log("Please fill in all required fields");
      return;
    }

    // Send form data to the server
    try {
      const formData = await addPost({
        variables: {
          postTitle,
          postContent,
          postImageURL: imageUploadUrl, //using Cloudinary URL here
          postDate,
          author: currentUser,
        },
      });
      console.log("form data", formData);

      // Reset form fields
      setPostFormState(initialState);
      setShowPostForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const { data } = await uploadPostImage({
        variables: { file },
      });

      // data.uploadPostImage contains the Cloudinary URL for the uploaded image
      setImageUploadUrl(data.uploadPostImage);
    } catch (error) {
      console.error('Error uploading image', error);
    }
  };

  const { postTitle, postContent } = postFormState;

  return (
    <div className="form-post-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="postTitle">Title: </label>
        <input
          type="text"
          className="form-post-input"
          id="postTitle"
          value={postTitle}
          onChange={(e) =>
            setPostFormState((prevState) => ({
              ...prevState,
              postTitle: e.target.value,
            }))
          }
        />

        <label htmlFor="input-content">Content: </label>
        <input
          type="text"
          className="form-post-input"
          id="input-content"
          value={postContent}
          onChange={(e) =>
            setPostFormState((prevState) => ({
              ...prevState,
              postContent: e.target.value,
            }))
          }
        />

        <label htmlFor="input-imageURL">Image Upload:</label>
        <input
          type="file"
          className="form-post-input"
          id="input-imageURL"
          onChange={handleImageUpload} // Use onChange to handle file input
        />
        {/* Display the uploaded image */}
        {imageUploadUrl && (
          <CloudinaryContext cloudName={cloudinaryCloudName}>
            <Image publicId={imageUploadUrl}>
              <Transformation width="200" height="200" crop="fill" />
            </Image>
          </CloudinaryContext>
        )}

        <button type="post-submit" className="post-submit-button">
          Submit Post
        </button>
      </form>
    </div>
  );
};

export default PostForm;

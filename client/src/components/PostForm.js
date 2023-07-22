import React from "react";
import UploadWidget from "./UploadWidget";
import moment from "moment-timezone";
// import axios from "axios";
// import { useMutation } from "@apollo/client";
// import { UPLOAD_POST_IMAGE } from "../utils/mutations";
import "../styles/PostForm.css";

const initialState = {
  postTitle: "",
  postContent: "",
  postImageURL: null,
};

const PostForm = ({
  addPost,
  postFormState,
  setPostFormState,
  setShowPostForm,
  currentUser,
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { postTitle, postContent, postImageURL } = postFormState;
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
          postImageURL,
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

        <UploadWidget />

        {/* <label htmlFor="input-imageURL">Image Upload:</label>
        <input
          type="file"
          className="form-post-input"
          id="input-imageURL"
          onChange={(e) =>
            setPostFormState((prevState) => ({
              ...prevState,
              postImageURL: e.target.value,
            }))} 
        /> */}

        <button
          type="post-submit"
          className="post-submit-button"
          onClick={handleSubmit}
        >
          Submit Post
        </button>
      </form>
    </div>
  );
};

export default PostForm;

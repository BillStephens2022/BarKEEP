import React, { useState } from "react";
import moment from "moment-timezone";
import UploadWidget from "./UploadWidget";
import "../styles/PostForm.css";

const initialState = {
  postTitle: "",
  postContent: "",
  postImageURL: "",
};

const PostForm = ({
  addPost,

  setShowPostForm,
  currentUser,
}) => {
  const [postFormState, setPostFormState] = useState(initialState);
  const [uploadedImageURL, setUploadedImageURL] = useState("");
  const [imageUploaded, setImageUploaded] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { postTitle, postContent } = postFormState;
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const postDate = moment().tz(userTimeZone).toDate();

    // Check if any required fields are empty
    if (!postTitle || !postContent || !imageUploaded) {
      console.log("Please fill in all required fields");
      return;
    }

    // Send form data to the server
    try {
      const formData = await addPost({
        variables: {
          postTitle,
          postContent,
          postImageURL: uploadedImageURL,
          postDate,
          author: currentUser,
        },
      });
      console.log("form data", formData);

      // Reset form fields
      setPostFormState(initialState);
      setUploadedImageURL("");
      setShowPostForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadSuccess = (result) => {
    if (result && result.event === "success") {
      console.log("Done! Here is the image info: ", result.info);
      console.log("secure_url: ", result.info.secure_url);
      setPostFormState((prevState) => ({
        ...prevState,
        postImageURL: result.info.secure_url,
      }));
      setUploadedImageURL(result.info.secure_url); 
      setImageUploaded(true); // 
    }
  };

  const { postTitle, postContent, postImageURL } = postFormState;

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

        <UploadWidget onSuccess={handleUploadSuccess} />

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
        >
          Submit Post
        </button>
      </form>
    </div>
  );
};

export default PostForm;

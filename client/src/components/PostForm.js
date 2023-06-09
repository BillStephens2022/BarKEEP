import React from "react";
import moment from 'moment-timezone';
import "../styles/CocktailForm.css";

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { postTitle, postContent, postImageURL } = postFormState;
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const postDate = moment().tz(userTimeZone).toDate();
 
    // console.log for debugging purposes
    console.log("Mutation Variables:", {
      postTitle,
      postContent,
      postImageURL,
      currentUser
    });
    // Check if any required fields are empty
    if (!postTitle || !postContent) {
      console.log("Please fill in all required fields");
      return;
    }

    // Send form data to the server
    try {
      console.log(currentUser);
      console.log(postTitle, postContent, postImageURL, currentUser);
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

  const { postTitle, postContent, postImageURL } =
    postFormState;

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="postTitle">Title: </label>
        <input
          type="text"
          id="postTitle"
          value={postTitle}
          onChange={(e) =>
            setPostFormState((prevState) => ({
              ...prevState,
              postTitle: e.target.value,
            }))
          }
        />

        <label htmlFor="postContent">Content: </label>
        <input
          type="text"
          id="postContent"
          value={postContent}
          onChange={(e) =>
            setPostFormState((prevState) => ({
              ...prevState,
              postContent: e.target.value,
            }))
          }
        />

        <label htmlFor="postImageURL">Image URL:</label>
        <input
          type="text"
          id="postImageURL"
          value={postImageURL}
          onChange={(e) =>
            setPostFormState((prevState) => ({
              ...prevState,
              postImageURL: e.target.value,
            }))
          }
        />

        <button type="submit">Submit Post</button>
      </form>
    </div>
  );
};

export default PostForm;

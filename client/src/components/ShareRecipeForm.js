import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import { useQuery, useMutation } from "@apollo/client";
import { ADD_POST } from "../utils/mutations";
import { QUERY_POSTS, QUERY_ME } from "../utils/queries";
import "../styles/components/PostForm.css";

// initial state of the form fields
const initialState = {
  postTitle: "",
  postContent: "",
  postImageURL: "",
  recipe: "",
};

const ShareRecipeForm = ({
  setShowShareRecipeForm,
  setShareRecipeFormState,
  selectedCocktail,
}) => {
  // State to manage the form fields
  const [postFormState, setPostFormState] = useState({
    ...initialState,
    postTitle: selectedCocktail.name + " Recipe",
    postImageURL: selectedCocktail.imageURL,
  });

  // Fetch the logged-in user's data and posts
  const { loading: userLoading, data: userData } = useQuery(QUERY_ME);
  const { loading: postsLoading, data: postsData } = useQuery(QUERY_POSTS);
  const [filteredPosts, setFilteredPosts] = useState(postsData?.posts || []);

  // Mutation to add a new post
  const [addPost] = useMutation(ADD_POST, {
    update(cache, { data: { addPost } }) {
      try {
        const { posts } = cache.readQuery({
          query: QUERY_POSTS,
        }) ?? { posts: [] };

        // Update the cache with the new post
        const updatedPosts = [addPost, ...posts];
        cache.writeQuery({
          query: QUERY_POSTS,
          data: { posts: updatedPosts },
        });

        // Update the user's posts array with the new post
        const { me } = cache.readQuery({ query: QUERY_ME });
        const updatedUserPosts = [addPost, ...me.posts];

        cache.writeQuery({
          query: QUERY_ME,
          data: {
            me: {
              ...me,
              posts: updatedUserPosts,
            },
          },
        });

        setFilteredPosts(updatedPosts);
      } catch (e) {
        console.log("error with mutation!");
        console.error(e);
      }
    },
    variables: {
      postTitle: postFormState.postTitle || undefined,
      postContent: postFormState.postContent || undefined,
      postImageURL: postFormState.postImageURL || undefined,
      likes: [],
    },
  });
  let navigate = useNavigate();

  // Get the current user's ID
  const currentUser = userData?.me?._id;

  // Handle the form submission
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
          postImageURL: postFormState.postImageURL,
          recipe: {
            _id: selectedCocktail._id,
            name: selectedCocktail.name,
            ingredients: selectedCocktail.ingredients,
            imageURL: selectedCocktail.imageURL,
            glassware: selectedCocktail.glassware,
            instructions: selectedCocktail.instructions,
            tags: selectedCocktail.tags,
          },
          postDate,
          author: currentUser,
        },
      });

      // Reset form fields
      setShareRecipeFormState(initialState);
      setShowShareRecipeForm(false);
      navigate("/community");
    } catch (err) {
      console.error(err);
    }
  };

  const { postTitle, postContent } = postFormState;

  return (
    <div className="form-post-container">
      {/* Display the selected cocktail's image */}
      <img
        src={selectedCocktail.imageURL}
        alt="cocktail to be shared"
        className="share-cocktail-img"
      />
      {/* Form to allow user to enter a title and additional content along with the recipe being shared */}
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

        <label htmlFor="input-content">Comment (required): </label>
        <input
          type="text"
          className="form-post-input"
          placeholder="Add comment here..."
          id="input-content"
          value={postContent}
          onChange={(e) =>
            setPostFormState((prevState) => ({
              ...prevState,
              postContent: e.target.value,
            }))
          }
        />
        <label htmlFor="postImageURL">Image URL: </label>
        <input
          type="text"
          className="form-post-input"
          id="postImageURL"
          value={postFormState.postImageURL}
          onChange={(e) =>
            setPostFormState((prevState) => ({
              ...prevState,
              postImageURL: e.target.value,
            }))
          }
        />

        <button type="submit" className="post-submit-button">
          Submit Post
        </button>
      </form>
    </div>
  );
};

export default ShareRecipeForm;

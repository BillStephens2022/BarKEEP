import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_POSTS, QUERY_ME } from "../utils/queries";
import { ADD_POST, DELETE_POST } from "../utils/mutations";
import { Auth } from "../utils/auth";
import Header from "../components/Header";
import PostForm from "../components/PostForm";
import Post from "../components/Post";
import ShimmerLoader from "../components/ShimmerLoader";
import "../styles/pages/CommunityPosts.css";
import "../styles/components/CocktailForm.css";

const CommunityPosts = ({ client }) => {
  // State for toggling the post creation form modal
  const [showPostForm, setShowPostForm] = useState(false);
  // State for the form inputs when creating a post
  const [postFormState, setPostFormState] = useState({
    postTitle: "",
    postContent: "",
    postImageURL: "",
  });

  // state to control how many posts are visible at a time,
  // user will be able to 'see more'
  const [visiblePosts, setVisiblePosts] = useState(10);

  // Fetch the user's data and all posts using useQuery (note: user will be able to see all posts posted by other users)
  const { loading: userLoading, data: userData } = useQuery(QUERY_ME);
  const { loading: postsLoading, data: postsData } = useQuery(QUERY_POSTS);
  
  // Destructure user data to get the user's posts
  const { me } = userData || {};
  const { posts: userPosts = [] } = me || {};

  const [filteredPosts, setFilteredPosts] = useState(postsData?.posts || []);
  
  // Use useMutation to add a new post
  const [addPost] = useMutation(ADD_POST, {
     // Update the cache after adding a new post
    update(cache, { data: { addPost } }) {
      try {
        const { posts } = cache.readQuery({
          query: QUERY_POSTS,
        }) ?? { posts: [] };

        const updatedPosts = [addPost, ...posts];

        cache.writeQuery({
          query: QUERY_POSTS,
          data: { posts: updatedPosts },
        });

        const { me } = cache.readQuery({ query: QUERY_ME });

        // Update the user's posts array with the new post
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

  // useMutation hook to delete a post
  const [deletePost] = useMutation(DELETE_POST, {
    update(cache, { data: { deletePost } }) {
      // Update the cache by removing the deleted post
      cache.modify({
        fields: {
          posts(existingPosts = [], { readField }) {
            return existingPosts.filter(
              (postRef) => deletePost?._id !== readField("_id", postRef)
            );
          },
        },
      });
    },
  });

  // Event handler for clicking on the delete button (i.e. the 'trash can' icon) on the post
  const handleDeletePost = async (postId) => {
    // Check if user is logged in
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) return false;
    // If user is logged in execute the deletePost mutation (which uses useMutation hook
    // defined in function above)
    try {
      await deletePost({
        variables: { postId },
        update(cache) {
          cache.evict({
            id: cache.identify({ __typename: "Post", _id: postId }),
          });
          cache.gc();
          setFilteredPosts((prevPosts) =>
            prevPosts.filter((post) => post._id !== postId)
          );
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  // ensures posts get re-sorted after there is a new post
  useEffect(() => {
    if (postsData?.posts) {
      let sortedPosts = [...postsData.posts];

      sortedPosts.sort((a, b) => {
        const dateA = parseInt(a.postDate);
        const dateB = parseInt(b.postDate);
        return dateB - dateA;
      });
      setFilteredPosts(sortedPosts);
    }
  }, [postsData, userPosts]);
  
  // render the ShimmerLoader component if data is being fetched
  if (userLoading || postsLoading) {
    return <ShimmerLoader />;
  }

  // Get the current user's ID
  const currentUser = userData?.me?._id;

  // isMyPosts is passed as a prop in the 'Post' component.
  // isMyPosts=true is used in the "Profile" page where user only sees
  // their own posts with delete button. Used for conditional rendering.
  const isMyPosts = false;

  return (
    <div className="community-posts">
      {/* Display page title using the Header component */}
      <Header subtitle="Community Posts" page="community posts" />
      <div className="community-posts-add-post-div">
        {/* Button to toggle the post form modal to create new posts */}
        <button
          className="btn btn-add-post"
          onClick={() => {
            setShowPostForm(!showPostForm);
          }}
        >
          Create a New Post
        </button>
      </div>
      {/* Display the posts container */}
      <div className="posts-container gradient-background">
        {filteredPosts.length > 0 ? (
          <Post
            data={postsData}
            loading={postsLoading}
            posts={filteredPosts.slice(0, visiblePosts)}
            addPost={addPost}
            handleDeletePost={handleDeletePost}
            isMyPosts={isMyPosts}
            page="Feed"
            visiblePosts={visiblePosts}
            setVisiblePosts={setVisiblePosts}
            client={client}
          />
        ) : (
          <h3 className="posts-error">No posts to display yet</h3>
        )}
      </div>
      {/* Display the create new post form modal */}
      {showPostForm && (
        <div className="modal-background">
          <div className="modal">
            <Modal show={true} onHide={() => setShowPostForm(false)}>
              <Modal.Header className="modal-title">
                <Modal.Title>Create Post</Modal.Title>
                <button
                  className="modal-close-button"
                  onClick={() => setShowPostForm(false)}
                >
                  &times;
                </button>
              </Modal.Header>
              <Modal.Body className="modal-body">
                <PostForm
                  setShowPostForm={setShowPostForm}
                  addPost={addPost}
                  postFormState={postFormState}
                  setPostFormState={setPostFormState}
                  currentUser={currentUser}
                />
              </Modal.Body>
            </Modal>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPosts;

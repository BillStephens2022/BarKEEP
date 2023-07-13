import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_POSTS, QUERY_ME } from "../utils/queries";
import { ADD_POST, DELETE_POST } from "../utils/mutations";
import { Auth } from "../utils/auth";
import PostForm from "../components/PostForm";
import Post from "../components/Post";
import "../styles/Feed.css";
import "../styles/CocktailForm.css";

// 'Feed' page shows all users' posts by default.  User can click on 'My Posts' to only
// show the current logged in user's posts.  Clicking on 'Create a New Post' will bring
// up a modal for the PostForm which will allow a user to create a post.
const Feed = ({ posts, setPosts }) => {
  const [showPostForm, setShowPostForm] = useState(false);
  const [postFormState, setPostFormState] = useState({
    postTitle: "",
    postContent: "",
    postImageURL: "",
  });

  const [isAllPosts, setIsAllPosts] = useState(true);
  const [isMyPosts, setIsMyPosts] = useState(false);

  const { loading: userLoading, data: userData } = useQuery(QUERY_ME);
  const { loading: postsLoading, data: postsData } = useQuery(QUERY_POSTS);

  const { me } = userData || {};
  const { posts: userPosts = [] } = me || {};

  const [filteredPosts, setFilteredPosts] = useState(postsData?.posts || []);

  const [addPost] = useMutation(ADD_POST, {
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

        if (isMyPosts) {
          setFilteredPosts(updatedUserPosts);
        } else {
          setFilteredPosts(updatedPosts);
        }
      } catch (e) {
        console.log("error with mutation!");
        console.error(e);
      }
    },
    variables: {
      postTitle: postFormState.postTitle || undefined,
      postContent: postFormState.postContent || undefined,
      postImageURL: postFormState.postImageURL || undefined,
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
          cache.evict({ id: cache.identify({ __typename: 'Post', _id: postId }) });
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

  useEffect(() => {
    if (postsData?.posts) {
      let sortedPosts = [...postsData.posts];
      if (isMyPosts) {
        sortedPosts = [...userPosts];
      }
      sortedPosts.sort((a, b) => {
        const dateA = parseInt(a.postDate);
        const dateB = parseInt(b.postDate);
        return dateB - dateA;
      });
      setFilteredPosts(sortedPosts);
    }
  }, [postsData, isMyPosts, userPosts]);

  // Function to handle the "All Posts" button click
  const handleAllPostsClick = () => {
    setIsAllPosts(true);
    setIsMyPosts(false);
    setFilteredPosts(postsData?.posts ? [...postsData.posts] : []);
  };

  // Function to handle the "My Posts" button click
  const handleMyPostsClick = () => {
    setIsAllPosts(false);
    setIsMyPosts(true);
    setFilteredPosts(userPosts);
  };

  if (userLoading || postsLoading) {
    return <div>Loading...</div>;
  }
  console.log(userData);
  const currentUser = userData?.me?._id;
  console.log(currentUser);

  return (
    <div className="feed">
      <div className="headings">
        <h1 className="title">BarKEEP</h1>
        <h2 className="subtitle">Cocktail Posts</h2>
        <div className="view-buttons">
          <button
            className={`btn btn-view ${isAllPosts ? "active" : ""}`}
            onClick={handleAllPostsClick}
          >
            All Posts
          </button>
          <button
            className={`btn btn-view ${isMyPosts ? "active" : ""}`}
            onClick={handleMyPostsClick}
          >
            My Posts
          </button>
        </div>
        <button
          className="btn btn-add-post"
          onClick={() => {
            setShowPostForm(!showPostForm);
          }}
        >
          Create a New Post
        </button>
        <div className="posts-container">
          <Post
            data={postsData}
            loading={postsLoading}
            posts={filteredPosts || []}
            addPost={addPost}
            handleDeletePost={handleDeletePost}
            isMyPosts={isMyPosts}
            page="Feed"
          />
        </div>
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
    </div>
  );
};

export default Feed;

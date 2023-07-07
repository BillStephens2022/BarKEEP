import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_POSTS, QUERY_ME } from "../utils/queries";
import { ADD_POST, DELETE_POST } from "../utils/mutations";

import PostForm from "../components/PostForm";
import Post from "../components/Post";
import "../styles/Feed.css";
import "../styles/CocktailForm.css";

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
  const {
    loading: postsLoading,
    data: postsData,
    refetch,
  } = useQuery(QUERY_POSTS);

  const { me } = userData || {};
  const { posts: userPosts = [] } = me || {};

  const [filteredPosts, setFilteredPosts] = useState(userPosts.slice());

  const [addPost] = useMutation(ADD_POST, {
    update(cache, { data: { addPost } }) {
      try {
        const { posts } = cache.readQuery({
          query: QUERY_POSTS,
        }) ?? { posts: [] };

        const updatedPosts = [addPost, ...posts].reverse();

        

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

  const [deletePost] = useMutation(DELETE_POST, {
    update(cache, { data: { deletePost } }) {
      try {
        const { posts } = cache.readQuery({
          query: QUERY_POSTS,
        }) ?? { posts: [] };

        const updatedPosts = posts.filter(
          (post) => post._id !== (deletePost?._id || null)
        );

        console.log("deletePost:", deletePost);

        cache.writeQuery({
          query: QUERY_POSTS,
          data: { posts: updatedPosts },
        });

        const { me } = cache.readQuery({ query: QUERY_ME });

        console.log("posts:", posts);

        cache.writeQuery({
          query: QUERY_ME,
          data: {
            me: {
              ...me,
              posts: updatedPosts,
            },
          },
        });
      } catch (e) {
        console.log("error with mutation!");
        console.error(e);
      }

      console.log("updated cache:", cache.data.data);
    },
  });


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
            deletePost={deletePost}
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

import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_POSTS, QUERY_ME } from "../utils/queries";
import { ADD_POST } from "../utils/mutations";
import AuthService from "../utils/auth";
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


  const { loading: userLoading, data: userData } = useQuery(QUERY_ME);
  const { loading: postsLoading, data: postsData, refetch } = useQuery(QUERY_POSTS);

  const currentUser = userData?.me?._id;

  const [addPost] = useMutation(ADD_POST, {
    update(cache, { data: { addPost } }) {
      try {
        const { posts } = cache.readQuery({
          query: QUERY_POSTS,
        }) ?? { posts: [] };

        cache.writeQuery({
          query: QUERY_POSTS,
          data: { posts: [addPost, ...posts].reverse() },
        });
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
    onCompleted: () => {
      refetch();
    },
  });
  
  if (userLoading || postsLoading) {
    return <div>Loading...</div>;
  }
  

  return (
    <div className="feed">
      <div className="headings">
        <h1 className="title">BarKEEP</h1>
        <h2 className="subtitle">Cocktail Posts</h2>
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
          posts={postsData?.posts || []}
          addPost={addPost}
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

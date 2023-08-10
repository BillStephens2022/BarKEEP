import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_POSTS, QUERY_ME } from "../utils/queries";
import { ADD_POST, DELETE_POST } from "../utils/mutations";
import { Auth } from "../utils/auth";
import PostForm from "../components/PostForm";
import Post from "../components/Post";
import ProfilePhoto from "../components/ProfilePhoto";
import "../styles/pages/Feed.css";
import "../styles/components/CocktailForm.css";

const CommunityPosts = ({ client }) => {
  const [showPostForm, setShowPostForm] = useState(false);
  const [postFormState, setPostFormState] = useState({
    postTitle: "",
    postContent: "",
    postImageURL: "",
  });

  // state to control how many posts are visible at a time,
  // user will be able to 'see more'
  const [visiblePosts, setVisiblePosts] = useState(10);

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

  if (userLoading || postsLoading) {
    return <div>Loading...</div>;
  }

  const currentUser = userData?.me?._id;

  // isMyPosts is passed as a prop in the 'Post' component. 
  // isMyPosts=true is used in the "Profile" page where user only sees 
  // their own posts with delete button. Used for conditional rendering.
  const isMyPosts = false;  
 
  return (
    <div className="feed">
      <div className="feed-headings">
        <div className="user-heading">
          <div className="user-profile">
            <ProfilePhoto
              imageUrl={
                me?.profilePhoto
                  ? me?.profilePhoto
                  : "https://helloartsy.com/wp-content/uploads/kids/food/how-to-draw-a-martini-glass/how-to-draw-a-martini-glass-step-6.jpg"
              }
              size={64}
            />
          </div>
          <h3 className="feed-username">{me?.username}</h3>
        </div>
        <h1 className="feed-title">BarKEEP</h1>
        <h2 className="feed-subtitle">Cocktail Posts</h2>

        <button
          className="btn btn-add-post"
          onClick={() => {
            setShowPostForm(!showPostForm);
          }}
        >
          Create a New Post
        </button>
      </div>
      <div className="posts-container">
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
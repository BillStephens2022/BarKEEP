import React, { useState, useEffect } from "react";
import { GoTrash } from "react-icons/go";
import { BiLike, BiComment, BiSolidLike } from "react-icons/bi";
import { TiArrowForward } from "react-icons/ti";
import { useMutation, useQuery } from "@apollo/client";
import { QUERY_ME, QUERY_POSTS, GET_POST_LIKES_USERS } from "../utils/queries";
import { ADD_LIKE, ADD_COMMENT } from "../utils/mutations";
import { Auth } from "../utils/auth";
import { formatElapsedTime } from "../utils/formatting";
import ProfilePhoto from "./ProfilePhoto";
import PostPhoto from "./PostPhoto";
import PostLikesModal from "./PostLikesModal";
import PostCommentsModal from "./PostCommentsModal";
import RecipeModal from "./RecipeModal";
import ShimmerLoader from "./ShimmerLoader";
import "../styles/pages/CommunityPosts.css";

const Post = ({
  loading,
  posts,
  handleDeletePost,
  isMyPosts,
  visiblePosts,
  setVisiblePosts,
  client,
}) => {
  const { loading: meLoading, data: meData } = useQuery(QUERY_ME);

  // State to manage updated posts
  const [updatedPosts, setUpdatedPosts] = useState(posts);
  // States to manage (likes, comments, recipe) modal visibility
  const [showLikesModal, setShowLikesModal] = useState(false); 
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  // State to store selected post id for the modal
  const [selectedPostId, setSelectedPostId] = useState(null); 
  // State to store selected recipe for the modal
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Separate loading state for liked users query
  const [likedUsers, setLikedUsers] = useState([]);

  // Mutation for adding a comment to a post
  const [addComment] = useMutation(ADD_COMMENT, {
    // The update function to update the cache after adding a comment
    update(cache, { data: { addComment } }) {
      try {
        // Read the current cached posts
        const { posts } = cache.readQuery({
          query: QUERY_POSTS,
        });

        // Find the post to which the comment was added and update its comments
        const updatedPosts = posts.map((post) => {
          if (post._id === addComment._id) {
            return { ...post, comments: [...post.comments, addComment] };
          }
          return post;
        });

        // Write the updated posts back to the cache
        cache.writeQuery({
          query: QUERY_POSTS,
          data: { posts: updatedPosts },
        });
      } catch (error) {
        console.error("Error updating cache:", error);
      }
    },
    refetchQueries: [{ query: QUERY_POSTS }], // Refetch the posts to update the UI
  });

  // Mutation for adding a 'like' to a post
  const [addLike] = useMutation(ADD_LIKE, {
    update(cache, { data: { addLike } }) {
      try {
        if (!addLike || !addLike.post) {
          console.error("Error: 'addLike' or 'addLike.post' is undefined.");
          return;
        }
        // Update the cache to include the new like in the relevant post
        const { posts } = cache.readQuery({
          query: QUERY_POSTS,
        });

        const updatedPosts = posts.map((post) => {
          if (post._id === addLike.post._id) {
            return { ...post, likes: [...post.likes, addLike] };
          }
          return post;
        });

        cache.writeQuery({
          query: QUERY_POSTS,
          data: { posts: updatedPosts },
        });

        // Update the likedPosts field in the User document
        const { me } = cache.readQuery({ query: QUERY_ME });

        cache.writeQuery({
          query: QUERY_ME,
          data: {
            me: {
              ...me,
              likedPosts: [...me.likedPosts, addLike.post._id],
            },
          },
        });

        const updatedPostIndex = updatedPosts.findIndex(
          (post) => post._id === addLike.post._id
        );
        if (updatedPostIndex !== -1) {
          updatedPosts[updatedPostIndex] = {
            ...updatedPosts[updatedPostIndex],
            likes: [...updatedPosts[updatedPostIndex].likes, addLike],
          };
        }
        setUpdatedPosts([...updatedPosts]);
      } catch (error) {
        console.error("Error updating cache:", error);
      }
    },
    refetchQueries: [{ query: QUERY_POSTS }, { query: QUERY_ME }],
  });

  // Fetch liked users data when selectedPostId changes
  useEffect(() => {
    if (selectedPostId) {
      fetchLikedUsersData(selectedPostId);
    }
  }, [selectedPostId]);

  // Fetch liked users data from the server
  const fetchLikedUsersData = async (postId) => {
    try {
      const { data } = await client.query({
        query: GET_POST_LIKES_USERS,
        variables: { postId },
      });
      setLikedUsers(data.postLikesUsers);
    } catch (error) {
      console.error("Error fetching liked users data:", error);
    }
  };
  
  // Update the state when the posts prop changes
  useEffect(() => {
    setUpdatedPosts(posts);
  }, [posts]);

  // Display the ShimmerLoader component when data is loading
  if (loading || meLoading) {
    return <ShimmerLoader />;
  }

  // Display message if there are no posts
  if (!posts.length) {
    return <h3 className="posts_error">No posts to display yet</h3>;
  }

  // Function to load more posts
  const handleSeeMoreClick = () => {
    setVisiblePosts((prevValue) => prevValue + 10);
  };
  
  // Function to open post comments modal
  const handlePostCommentsClick = (postId) => {
    setSelectedPostId(postId);
    setShowCommentsModal(true);
  };
  
  // Function to open post likes modal
  const handlePostLikeCountClick = (postId) => {
    setSelectedPostId(postId);
    setShowLikesModal(true);
  };

  return (
    <>
      {updatedPosts.map((post) => {
        const isMyPost = post.author._id === Auth.getProfile()?.data?._id;

        // Check if the current post is liked by the user
        const isPostLikedByUser =
          meData?.me?.likedPosts?.some(
            (likedPost) => likedPost._id === post._id
          ) || false;

        // JSX for each post
        return (
          <div className="post-card" key={post._id}>
            {/* Post header */}
            <div className="post-header">
              {/* ... (profile photo, author name, post date) */}
              <div className="post-author">
                <ProfilePhoto
                  imageUrl={
                    post.author && post.author.profilePhoto
                      ? post.author.profilePhoto
                      : meData?.me?.profilePhoto
                  }
                  size={48}
                />
                <span className="post-author-name">{post.author.username}</span>
              </div>
              <div className="post-author-date">
                {formatElapsedTime(post.postDate)}
              </div>
            </div>
            {/* Main post content */}
            <div className="post-main-container">
              {/* ... (post image, title, content, recipe link) */}
              <div className="post-image">
                <PostPhoto imageUrl={post.postImageURL} />
              </div>
              <div className="post-title-and-content">
                <h3 className="post-title">{post.postTitle}</h3>
                <div className="post-content">{post.postContent}</div>
                {post.recipe && (
                  <div
                    className="post-recipe"
                    onClick={() => {
                      setSelectedRecipe(post.recipe);
                      setShowRecipeModal(true);
                    }}
                  >
                    See {post.recipe.name} Recipe:
                    <TiArrowForward />
                  </div>
                )}
              </div>
            </div>
            {/* Like and comment counts */}
            <div className="post-like-comment-counts">
              {/* ... (like count with icon, comment count with icon) */}
              <div
                className="post-counts"
                onClick={() => handlePostLikeCountClick(post._id)}
              >
                <BiLike />
                <h6 id="post-counts-likes">
                  {isPostLikedByUser
                    ? post.likes.length === 1
                      ? "You liked this"
                      : post.likes.length === 2
                      ? `You and 1 other liked this`
                      : `You and ${post.likes.length - 1} others liked this`
                    : post.likes?.length}
                </h6>
              </div>
              <div
                className="post-counts"
                onClick={() => handlePostCommentsClick(post._id)}
              >
                <h6 id="post-counts-comments">
                  {post.comments?.length === 1
                    ? `${post.comments?.length} comment`
                    : `${post.comments?.length} comments`}
                </h6>
              </div>
            </div>
            {/* Post footer */}
            <div className="post-footer">
              <div className="post-comment-like">
                {/* Like button */}
                <div className="post-like-button">
                  <button
                    className="btn btn-post-like"
                    id={`post-like-${post._id}`}
                    onClick={() => {
                      addLike({
                        variables: { postId: post._id },
                      });
                    }}
                  >
                    {/* ... (like icon based on user's like status) */}
                    {isPostLikedByUser ? (
                      <BiSolidLike className="like-icon-solid" />
                    ) : (
                      <BiLike />
                    )}
                  </button>
                  {/* ... (like label based on user's like status) */}
                  <h6
                    className={`post-like-label ${
                      !isPostLikedByUser ? null : "liked"
                    }`}
                    id="post-like-label"
                  >
                    {isPostLikedByUser ? "Liked" : "Like"}
                  </h6>
                </div>
                {/* Comment button */}
                <div className="post-comment-button">
                  <button
                    className="btn btn-post-comment"
                    id={`post-comment-${post._id}`}
                    onClick={() => handlePostCommentsClick(post._id)}
                  >
                    <BiComment />
                  </button>

                  <h6 id="post-comment-label">Comment</h6>
                </div>
                {/* Delete button (visible only for the post owner in MyPosts view on Profile page) */}
                {isMyPosts && isMyPost && (
                  <div className="div-delete-button">
                    <button
                      className="btn btn-post-delete"
                      id={post._id}
                      onClick={() => handleDeletePost(post._id)}
                    >
                      <GoTrash />
                    </button>
                    <h6 id="post-delete-label">Delete</h6>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      {/* Modals */}
      {/* ... (likes, comments, recipe modals) */}
      {showLikesModal && selectedPostId && (
        <PostLikesModal
          postId={selectedPostId}
          onClose={() => setShowLikesModal(false)} // Close the modal
        />
      )}

      {showCommentsModal && selectedPostId && (
        <PostCommentsModal
          postId={selectedPostId}
          addComment={addComment}
          onClose={() => setShowCommentsModal(false)} // Close the modal
        />
      )}

      {showRecipeModal && selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => {
            setSelectedRecipe(null);
            setShowRecipeModal(false);
          }}
        />
      )}
      {/* "See More" button */}
      {visiblePosts <= posts.length && (
        <div className="see-more-container">
          <button className="btn btn-see-more" onClick={handleSeeMoreClick}>
            See More
          </button>
        </div>
      )}
    </>
  );
};

export default Post;

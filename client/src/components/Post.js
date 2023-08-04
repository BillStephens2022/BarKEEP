import React, { useState, useEffect } from "react";
import { GoTrash } from "react-icons/go";
import { BiLike, BiComment, BiSolidLike } from "react-icons/bi";
import { useMutation, useQuery } from "@apollo/client";
import { QUERY_ME, QUERY_POSTS, GET_POST_LIKES_USERS } from "../utils/queries";
import { ADD_LIKE, ADD_COMMENT } from "../utils/mutations";
import { Auth } from "../utils/auth";
import { formatElapsedTime } from "../utils/formatting";
import ProfilePhoto from "./ProfilePhoto";
import PostPhoto from "./PostPhoto";
import PostLikesModal from "./PostLikesModal";
import PostCommentsModal from "./PostCommentsModal";
import "../styles/Feed.css";

const Post = ({
  loading,
  posts,
  handleDeletePost,
  isMyPosts,
  visiblePosts,
  setVisiblePosts,
  client
}) => {
  const { loading: meLoading, data: meData } = useQuery(QUERY_ME);

  const [updatedPosts, setUpdatedPosts] = useState(posts);
  const [showLikesModal, setShowLikesModal] = useState(false); // State to manage modal visibility
  const [showCommentsModal, setShowCommentsModal] = useState(false); // State to manage modal visibility
  const [selectedPostId, setSelectedPostId] = useState(null); // State to store selected post id for the modal
  
  // Separate loading state for liked users query
  // const [likedUsersLoading, setLikedUsersLoading] = useState(false);
  const [likedUsers, setLikedUsers] = useState([]);

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

  useEffect(() => {
    if (selectedPostId) {
      // Fetch liked users data when selectedPostId changes
      fetchLikedUsersData(selectedPostId);
    }
  }, [selectedPostId]);

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

  useEffect(() => {
    setUpdatedPosts(posts);
  }, [posts]);

  if (loading || meLoading) {
    return <div>Loading...</div>;
  }

  if (!posts.length) {
    return <h3 className="posts_error">No posts to display yet</h3>;
  }

  const handleSeeMoreClick = () => {
    setVisiblePosts((prevValue) => prevValue + 10);
  };

  const handlePostCommentsClick = (postId) => {
    setSelectedPostId(postId);
    setShowCommentsModal(true);
  };

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
        return (
          <div className="post-card" key={post._id}>
            <div className="post-header">
              <div className="post-author">
                <ProfilePhoto
                  imageUrl={
                    post.author && post.author.profilePhoto
                      ? post.author.profilePhoto
                      : "https://helloartsy.com/wp-content/uploads/kids/food/how-to-draw-a-martini-glass/how-to-draw-a-martini-glass-step-6.jpg"
                  }
                  size={48}
                />
                <span className="post-author-name">{post.author.username}</span>
              </div>
              <div className="post-author-date">
                {formatElapsedTime(post.postDate)}
              </div>
            </div>
            <div className="post-main-container">
              <div className="post-image">
                <PostPhoto imageUrl={post.postImageURL} />
              </div>
              <div className="post-title-and-content">
                <h3 className="post-title">{post.postTitle}</h3>
                <div className="post-content">{post.postContent}</div>
              </div>
            </div>

            <div className="post-footer">
              {isMyPosts && isMyPost && (
                <div className="div-delete-button">
                  <button
                    className="btn btn-post-delete"
                    id={post._id}
                    onClick={() => handleDeletePost(post._id)}
                  >
                    <GoTrash />
                  </button>
                </div>
              )}

              <div className="post-comment-like">
                <button
                  className="btn btn-post-comment"
                  id={`post-comment-${post._id}`}
                  onClick={() => handlePostCommentsClick(post._id)}
                >
                  <BiComment />
                </button>
                <h6 id="post-comment-count">{post.comments.length}</h6>
                <button
                  className="btn btn-post-like"
                  id={`post-like-${post._id}`}
                  onClick={() => {
                    addLike({
                      variables: { postId: post._id },
                    });
                  }}
                >
                  {isPostLikedByUser ? (
                    <BiSolidLike className="like-icon-solid" />
                  ) : (
                    <BiLike />
                  )}
                </button>
                <h6
                  id="post-like-count"
                  onClick={() => handlePostLikeCountClick(post._id)}
                >
                  {isPostLikedByUser
                    ? post.likes.length === 2
                      ? `You and 1 other liked this post`
                      : `You and ${
                          post.likes.length - 1
                        } others liked this post`
                    : post.likes?.length}
                </h6>
              </div>
            </div>
          </div>
        );
      })}

      {showLikesModal && selectedPostId && (
        <PostLikesModal
          postId={selectedPostId}
          onClose={() => setShowLikesModal(false)} // Close the modal
        />
      )}

      {showCommentsModal && selectedPostId && (
        <PostCommentsModal
          postId={selectedPostId}
          onClose={() => setShowCommentsModal(false)} // Close the modal
        />
      )}

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

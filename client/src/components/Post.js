import React from "react";
import { GoTrashcan } from "react-icons/go";
import { QUERY_ME } from "../utils/queries";
import Auth from "../utils/auth";
import { formatDate } from "../utils/formatting";
import "../styles/Feed.css";

const Post = ({
  data,
  loading,
  posts,
  setPosts,
  page,
  addPost,
  deletePost,
  isMyPosts
}) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!posts.length) {
    return <h3 className="posts_error">No posts to display yet</h3>;
  }

  const sortedPosts = [...posts].sort((a, b) => {
    return new Date(b.postDate) - new Date(a.postDate);
  });

  const reversedPosts = sortedPosts.reverse();

  const handleDeletePost = async (postId) => {
    // e.preventDefault();
    console.log("attempting to delete post: ", postId);
    // const postId = e.currentTarget.id;
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) return false;
    console.log("deleting post!");
    try {
      const { data } = await deletePost({
        variables: { postId },
        refetchQueries: [{ query: QUERY_ME }],
      });
      if (!data) {
        throw new Error("something went wrong!");
      }
      console.log("done!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {reversedPosts.map((post) => {
        const isMyPost = post.author._id === Auth.getProfile()?.data?._id;
        return (
          <div className="post-card" key={post._id}>
            <div className="post-title">{post.postTitle}</div>
            <div className="post-content">{post.postContent}</div>
            <div
              className="post-image"
              style={{ backgroundImage: `url(${post.postImageURL})` }}
            ></div>
            <div className="post-author">Posted by: {post.author.username}</div>
            <div className="post-author">{formatDate(post.postDate)}</div>
            {isMyPosts && isMyPost && (
              <button
                className="btn"
                id={post._id}
                onClick={() => handleDeletePost(post._id)}
              >
                <GoTrashcan />
              </button>
            )}
          </div>
        );
      })}
    </>
  );
};

export default Post;

import React from "react";
import { GoTrash } from "react-icons/go";
import { Auth } from "../utils/auth";
import { formatDate } from "../utils/formatting";
import "../styles/Feed.css";

const Post = ({
  loading,
  posts,
  handleDeletePost,
  isMyPosts,
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

  // const reversedPosts = sortedPosts.reverse();

  return (
    <>
      {sortedPosts.map((post) => {
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
                <GoTrash />
              </button>
            )}
          </div>
        );
      })}
    </>
  );
};

export default Post;

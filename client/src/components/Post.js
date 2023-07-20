import React from "react";
import { GoTrash } from "react-icons/go";
import { Auth } from "../utils/auth";
import { formatElapsedTime } from "../utils/formatting";
import "../styles/Feed.css";

const Post = ({
  loading,
  posts,
  handleDeletePost,
  isMyPosts,
  visiblePosts,
  setVisiblePosts,
}) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!posts.length) {
    return <h3 className="posts_error">No posts to display yet</h3>;
  }

  const handleSeeMoreClick = () => {
    setVisiblePosts((prevValue) => prevValue + 10);
  };

  return (
    <>
      {posts.map((post) => {
        const isMyPost = post.author._id === Auth.getProfile()?.data?._id;
        return (
          <div className="post-card" key={post._id}>
            <div className="post-main-container">
              <div
                className="post-image"
              ><img src={post.postImageURL} alt="Post Image" /></div>
              <div className="post-title-and-content">
                <h3 className="post-title">{post.postTitle}</h3>
                <div className="post-content">{post.postContent}</div>
              </div>
            </div>

            <div className="post-footer">
              <div className="post-author">
                Posted by: {post.author.username}
              </div>
              <div className="post-author">{formatElapsedTime(post.postDate)}</div>
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
          </div>
        );
      })}

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

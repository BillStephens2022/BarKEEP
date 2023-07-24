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
        console.log(post);
        console.log("profilePhoto URL: ", post.author.profilePhoto);
        return (
          <div className="post-card" key={post._id}>
            <div className="post-header">
              <div className="post-author">
                <img
                  className="post-author-image"
                  src={post.author.profilePhoto ? post.author.profilePhoto : "https://helloartsy.com/wp-content/uploads/kids/food/how-to-draw-a-martini-glass/how-to-draw-a-martini-glass-step-6.jpg"}
                  alt="user avatar"
                ></img>
                <span className="post-author-name">{post.author.username}</span>
              </div>
              <div className="post-author-date">
                {formatElapsedTime(post.postDate)}
              </div>
            </div>
            <div className="post-main-container">
              <div className="post-image">
                <img src={post.postImageURL} alt="Post" />
              </div>
              <div className="post-title-and-content">
                <h3 className="post-title">{post.postTitle}</h3>
                <div className="post-content">{post.postContent}</div>
              </div>
            </div>

            <div className="post-footer">
              {isMyPosts && isMyPost && (
                <button
                  className="btn btn-post-delete"
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

import React from "react";
import { GoTrash } from "react-icons/go";
import { BiLike, BiComment } from "react-icons/bi";
import { Auth } from "../utils/auth";
import { formatElapsedTime } from "../utils/formatting";
import ProfilePhoto from "./ProfilePhoto";
import PostPhoto from "./PostPhoto";
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
            <div className="post-header">
              <div className="post-author">
                <ProfilePhoto
                  imageUrl={
                    post.author.profilePhoto
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
              {!isMyPosts && (
                <div className="post-comment-like">
                  <button
                    className="btn btn-post-comment"
                    id={`post-comment-${post._id}`}
                  >
                    <BiComment />
                  </button>
                  <h6 id="post-comment-count">12</h6>
                  <button
                    className="btn btn-post-like"
                    id={`post-like-${post._id}`}
                  >
                    <BiLike />
                  </button>
                  <h6 id="post-like-count">33</h6>
                </div>
              )}

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

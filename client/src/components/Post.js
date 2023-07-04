import React, { useState } from "react";
import { GoPencil, GoTrashcan, GoPlus } from "react-icons/go";
import { QUERY_ME, QUERY_POSTS } from "../utils/queries";
import Auth from "../utils/auth";
import "../styles/Feed.css";
import "../styles/CocktailCardLite.css";

const Post = ({ data, loading, posts, setPosts, page, addPost }) => {

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!posts.length) {
    return <h3 className="posts_error">No posts to display yet</h3>;
  }

  const { me } = data;
  console.log("me:", me);
  console.log("posts:", posts);
  

  return (
    <>
      {posts.map((post) => {
        return (
        <div className="post-container" key={post._id}>
          <div
            className="post-image"
            style={{ backgroundImage: `url(${post.postImageURL})` }}
          >
            <div className="post-title">{post.postTitle}</div>
            <div className="post-content">{post.postContent}</div>
            <div className="post-author">{post.author.username}</div>
          </div>
        </div>
        );
      })}
    </>
  );
};

export default Post;

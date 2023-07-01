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

  return (
    <>
      {posts.map((post) => (
        <div className="card card-cocktail-lite" key={post._id}>
          <div
            className="card-content"
            style={{ backgroundImage: `url(${post.postImageURL})` }}
          >
            <div className="card-title-lite">{post.postTitle}</div>
            <div className="card-cocktail-lite-footer">{post.postContent}</div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Post;

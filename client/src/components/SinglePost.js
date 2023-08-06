import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_ME, GET_SINGLE_POST } from "../utils/queries";
import { Auth } from "../utils/auth";
import { formatElapsedTime } from "../utils/formatting";
import ProfilePhoto from "./ProfilePhoto";
import PostPhoto from "./PostPhoto";
import "../styles/pages/Feed.css";

const SinglePost = ({
  loading,
  posts,
  handleDeletePost,
  isMyPosts,
  visiblePosts,
  setVisiblePosts,
  client,
  postId
}) => {
  const { loading: meLoading, data: meData } = useQuery(QUERY_ME);
  const { loading: postLoading, data: postData } = useQuery(GET_SINGLE_POST, {
    variables: { postId },
  });

  const post = postData?.getSinglePost;

  if (meLoading || postLoading) {
    return <div>Loading...</div>;
  }

  const isMyPost = post.author._id === Auth.getProfile()?.data?._id;
  const isPostLikedByUser =
    meData?.me?.likedPosts?.some((likedPost) => likedPost._id === post._id) ||
    false;

  return (
    <>
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
     

        </div>
      </div>
    </>
  );
};

export default SinglePost;

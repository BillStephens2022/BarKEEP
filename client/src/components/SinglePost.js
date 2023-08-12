import React from "react";
import { useQuery } from "@apollo/client";
import { GET_SINGLE_POST } from "../utils/queries";
import { formatElapsedTime } from "../utils/formatting";
import ProfilePhoto from "./ProfilePhoto";
import PostPhoto from "./PostPhoto";
import "../styles/pages/Feed.css";

const SinglePost = ({
  postId
}) => {
  
  const { loading: postLoading, data: postData } = useQuery(GET_SINGLE_POST, {
    variables: { postId },
  });

  const post = postData?.getSinglePost;

  if (postLoading) {
    return <div>Loading...</div>;
  }

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

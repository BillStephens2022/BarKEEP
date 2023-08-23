import React from "react";
import { useQuery } from "@apollo/client";
import { GET_SINGLE_POST } from "../utils/queries";
import { formatElapsedTime } from "../utils/formatting";
import ProfilePhoto from "./ProfilePhoto";
import PostPhoto from "./PostPhoto";
import ShimmerLoader from "./ShimmerLoader";
import "../styles/pages/CommunityPosts.css";

const SinglePost = ({ postId }) => {
  // Fetch the single post data based onthe postId prop
  const { loading: postLoading, data: postData } = useQuery(GET_SINGLE_POST, {
    variables: { postId },
  });
  
  // Extract the post data from the fetched data
  const post = postData?.getSinglePost;
  
  // Display a shimmer loader while loading the post data
  if (postLoading) {
    return <ShimmerLoader />;
  }

  return (
    <>
      <div className="post-card" key={post._id}>
        {/* Display the post header with author information */}
        <div className="post-header">
          <div className="post-author">
            {/* Display the author's profile photo */}
            <ProfilePhoto
              imageUrl={
                post.author && post.author.profilePhoto
                  ? post.author.profilePhoto
                  : "https://helloartsy.com/wp-content/uploads/kids/food/how-to-draw-a-martini-glass/how-to-draw-a-martini-glass-step-6.jpg"
              }
              customClass="singlePostAuthor"
            />
            {/* Display the author's username */}
            <span className="post-author-name-singlePost">
              {post.author.username}
            </span>
          </div>
          {/* Display the formatted post date */}
          <div className="post-author-date-singlePost">
            {formatElapsedTime(post.postDate)}
          </div>
        </div>
        {/* Display the main content of the post */}
        <div className="post-main-container">
          <div className="post-image">
            {/* Display the post's image */}
            <PostPhoto imageUrl={post.postImageURL} />
          </div>
          <div className="post-title-and-content">
            {/* Display the post's title */}
            <h3 className="post-title">{post.postTitle}</h3>
             {/* Display the post's content */}
            <div className="post-content">{post.postContent}</div>
          </div>
        </div>

        <div className="post-footer"></div>
      </div>
    </>
  );
};

export default SinglePost;

import React from "react";
import { useQuery } from "@apollo/client";
import { QUERY_POSTS, QUERY_ME } from "../utils/queries";
import "../styles/Gallery.css";
import ProfilePhoto from "../components/ProfilePhoto";
import PostPhoto from "../components/PostPhoto";

const Gallery = () => {
  const { loading: userLoading, data: userData } = useQuery(QUERY_ME);
  const { loading: postsLoading, data: postsData } = useQuery(QUERY_POSTS);

  const { me } = userData || {};
  const { posts: allPosts = [] } = postsData || {};

    // Show loading message while data is being fetched
  if (userLoading || postsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="gallery">
      <div className="gallery-headings">
        <div className="gallery-heading">
          <div className="gallery-user-profile">
            <ProfilePhoto
              imageUrl={
                me.profilePhoto
                  ? me.profilePhoto
                  : "https://helloartsy.com/wp-content/uploads/kids/food/how-to-draw-a-martini-glass/how-to-draw-a-martini-glass-step-6.jpg"
              }
              size={64}
            />
          </div>
          <h3 className="gallery-username">{me.username}</h3>
        </div>
        <h1 className="gallery-title">BarKEEP</h1>
        <h2 className="gallery-subtitle">Photo Gallery</h2>
        <h2 className="gallery-subtitle-2">User Photos</h2>
      </div>
      <div className="gallery-grid">

        {allPosts.map((post) => (
          <div className="gallery-item" key={post._id}>
            <PostPhoto imageUrl={post.postImageURL} />
            <h5 className="gallery-item-author">Posted by: {post.author.username}</h5>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
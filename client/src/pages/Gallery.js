import React from "react";
import Masonry from "react-masonry-css";
import { useQuery } from "@apollo/client";
import { QUERY_POSTS } from "../utils/queries";
import Header from "../components/Header";
import PostPhoto from "../components/PostPhoto";
import "../styles/pages/Gallery.css";

const Gallery = () => {
  const { loading, data } = useQuery(QUERY_POSTS);

  const { posts: allPosts = [] } = data || {};

  // Show loading message while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  const breakpointColumnsObj = {
    default: 7, // Number of columns by default
    1100: 4,
    900: 3, // Number of columns for viewport width 1100px and above
    700: 2,
    500: 1, // Number of columns for viewport width 700px and above
  };

  return (
    <div className="gallery">
      <Header subtitle="Photo Gallery" page="gallery" />

      <div className="gallery-grid gradient-background">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="gallery-grid"
          columnClassName="gallery-item"
        >
          {allPosts.map((post) => (
            <div className="gallery-item" key={post._id}>
              <PostPhoto imageUrl={post.postImageURL} />
              <h5 className="gallery-item-author">
                Posted by: {post.author.username}
              </h5>
            </div>
          ))}
        </Masonry>
      </div>
    </div>
  );
};

export default Gallery;

import React from "react";
import Masonry from "react-masonry-css";
import { useQuery } from "@apollo/client";
import { QUERY_POSTS } from "../utils/queries";
import Header from "../components/Header";
import PostPhoto from "../components/PostPhoto";
import ShimmerLoader from "../components/ShimmerLoader";
import "../styles/pages/Gallery.css";


const Gallery = () => {
  // Use the useQuery hook to fetch all posts data from the server
  const { loading, data } = useQuery(QUERY_POSTS);

  // Destructure the 'posts' array from the 'data' object, with a default empty array
  const { posts: allPosts = [] } = data || {};

  // Show loading message (using the styled ShimmerLoader component) while data is being fetched
  if (loading) {
    return <ShimmerLoader />;
  }

  // Define the breakpoint columns for responsive masonry layout
  const breakpointColumnsObj = {
    default: 7, // Number of columns by default
    1100: 4,
    900: 3, // Number of columns for viewport width 1100px and above
    700: 2,
    500: 1, // Number of columns for viewport width 700px and above
  };
  
  // Reverse the order of posts to display most recent first
  const reversedPosts = [...allPosts].reverse();

  return (
    <div className="gallery">
      {/* Display page title and subtitle using the Header component */}
      <Header subtitle="Photo Gallery" page="gallery" />

      <div className="gallery-grid gradient-background">
        {/* Render the Masonry grid with responsive columns */}
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="gallery-grid"
          columnClassName="gallery-item"
        >
          {/* Map through posts to display the photo from each post as well as the author name as a grid item */}
          {reversedPosts.map((post) => (
            <div className="gallery-item" key={post._id}>
              {/* Display the post's photo using the PostPhoto component */}
              <PostPhoto imageUrl={post.postImageURL} />
              {/* Display the author's username */}
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

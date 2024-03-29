import React, { useState, useEffect } from "react";

import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { DELETE_POST } from "../utils/mutations";
import { Auth } from "../utils/auth";
import Post from "./Post";
import ShimmerLoader from "./ShimmerLoader";
import "../styles/pages/Profile.css";

const MyPosts = ({ client }) => {
  // state to control how many posts are visible at a time,
  // user will be able to 'see more'
  const [visiblePosts, setVisiblePosts] = useState(10);

  // Query user data to get logged-in user's posts
  const { loading: userLoading, data: userData } = useQuery(QUERY_ME);
  const { me } = userData || {};
  const { posts } = me || {};

  // State to hold filtered and sorted posts
  const [filteredPosts, setFilteredPosts] = useState(posts || []);
  
  // Mutation to delete a post
  const [deletePost] = useMutation(DELETE_POST, {
    update(cache, { data: { deletePost } }) {
      // Update the cache by removing the deleted post
      cache.modify({
        fields: {
          posts(existingPosts = [], { readField }) {
            return existingPosts.filter(
              (postRef) => deletePost?._id !== readField("_id", postRef)
            );
          },
        },
      });
    },
  });


  // Event handler for clicking on the delete button (i.e. the 'trash can' icon) on the post
  const handleDeletePost = async (postId) => {
    // Check if user is logged in
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) return false;
    // If user is logged in execute the deletePost mutation (which uses useMutation hook
    // defined in function above)
    try {
      await deletePost({
        variables: { postId },
        update(cache) {
          // Evict the deleted post from the cache
          cache.evict({
            id: cache.identify({ __typename: "Post", _id: postId }),
          });
          cache.gc();
          // Update filteredPosts to remove the deleted post
          setFilteredPosts((prevPosts) =>
            prevPosts.filter((post) => post._id !== postId)
          );
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  // ensures posts get re-sorted after there is a new post
  useEffect(() => {
    if (posts) {
      let sortedPosts = [...posts];

      sortedPosts.sort((a, b) => {
        const dateA = parseInt(a.postDate);
        const dateB = parseInt(b.postDate);
        return dateB - dateA;
      });
      setFilteredPosts(sortedPosts);
    }
  }, [posts]);

  // render the ShimmerLoader component when data is loading
  if (userLoading) {
    return <ShimmerLoader />;
  }

  const isMyPosts = true;
  
  // Render MyPosts component
  return (
    <div className="posts-container gradient-background">
      {filteredPosts.length > 0 ? (
        <Post
          data={userData}
          loading={userLoading}
          posts={filteredPosts.slice(0, visiblePosts)}
          handleDeletePost={handleDeletePost}
          page="Profile"
          visiblePosts={visiblePosts}
          setVisiblePosts={setVisiblePosts}
          client={client}
          isMyPosts={isMyPosts}
        />
      ) : (
        <h3 className="posts-error">No posts to display yet</h3>
      )}
    </div>
  );
};

export default MyPosts;

import React, { useState, useEffect } from "react";
import { GoTrash } from "react-icons/go";
import { BiLike, BiComment, BiSolidLike } from "react-icons/bi";
import { useMutation, useQuery } from "@apollo/client";
import { QUERY_ME, QUERY_POSTS } from "../utils/queries";
import { ADD_LIKE } from "../utils/mutations";
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
  const { loading: meLoading, data: meData } = useQuery(QUERY_ME);

  const [updatedPosts, setUpdatedPosts] = useState(posts);

  const [addLike] = useMutation(ADD_LIKE, {
    update(cache, { data: { addLike } }) {
      try {
        if (!addLike || !addLike.post) {
          console.error("Error: 'addLike' or 'addLike.post' is undefined.");
          return;
        }
        // Update the cache to include the new like in the relevant post
        const { posts } = cache.readQuery({
          query: QUERY_POSTS,
        });

        const updatedPosts = posts.map((post) => {
          if (post._id === addLike.post._id) {
            return { ...post, likes: [...post.likes, addLike] };
          }
          return post;
        });

        cache.writeQuery({
          query: QUERY_POSTS,
          data: { posts: updatedPosts },
        });

        // Update the likedPosts field in the User document
        const { me } = cache.readQuery({ query: QUERY_ME });

        cache.writeQuery({
          query: QUERY_ME,
          data: {
            me: {
              ...me,
              likedPosts: [...me.likedPosts, addLike.post._id],
            },
          },
        });
        
        const updatedPostIndex = updatedPosts.findIndex(
          (post) => post._id === addLike.post._id
        );
        if (updatedPostIndex !== -1) {
          updatedPosts[updatedPostIndex] = {
            ...updatedPosts[updatedPostIndex],
            likes: [...updatedPosts[updatedPostIndex].likes, addLike],
          };
        }
        setUpdatedPosts([...updatedPosts]);
      } catch (error) {
        console.error("Error updating cache:", error);
      }
    },
    refetchQueries: [{ query: QUERY_POSTS }, { query: QUERY_ME }],
  });

  useEffect(() => {
    setUpdatedPosts(posts);
  }, [posts]);

  console.log("meData:", meData);
  console.log("likedPosts:", meData?.me?.likedPosts);

  if (loading || meLoading) {
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
      {updatedPosts.map((post) => {
        const isMyPost = post.author._id === Auth.getProfile()?.data?._id;

        // Check if the current post is liked by the user
        const isPostLikedByUser =
          meData?.me?.likedPosts?.some(
            (likedPost) => likedPost._id === post._id
          ) || false;
        console.log("isPostLikedByUser:", isPostLikedByUser);
        return (
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
                    onClick={() => {
                      addLike({
                        variables: { postId: post._id },
                      });
                    }}
                  >
                    {isPostLikedByUser ? <BiSolidLike className="like-icon-solid"/> : <BiLike />}
                  </button>
                  <h6 id="post-like-count">{post.likes.length}</h6>
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

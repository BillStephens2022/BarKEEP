import { gql } from "@apollo/client";

// Query the current logged in user to get deatils including username, profilePhoto, email, cocktail recipes saved to profile, posts, comments, liked posts
export const QUERY_ME = gql`
  query Me {
    me {
      _id
      email
      username
      cocktails {
        _id
        glassware
        imageURL
        ingredients {
          name
          quantity
        }
        instructions
        name
        tags
      }
      posts {
        _id
        postTitle
        postContent
        postImageURL
        postDate
        author {
          _id
          username
        }
        likes {
          _id
          username
          profilePhoto
        }
        comments {
          _id
          text
          author {
            _id
            username
            profilePhoto
          }
        }
        recipe {
          _id
          glassware
          imageURL
          ingredients {
            name
            quantity
          }
          instructions
          name
          tags
        }
      }
      likedPosts {
        _id
        postTitle
        postContent
        postImageURL
        postDate
        author {
          _id
          username
        }
        likes {
          _id
        }
      }
      profilePhoto
    }
  }
`;

// query all cocktail recipes saved to the database
export const QUERY_COCKTAILS = gql`
  query Cocktails {
    cocktails {
      _id
      glassware
      imageURL
      ingredients {
        name
        quantity
      }
      instructions
      name
      tags
    }
  }
`;

// query all posts including comments on that post, likes, and the author's details for those posts
export const QUERY_POSTS = gql`
  query Posts {
    posts {
      _id
      postTitle
      postContent
      postImageURL
      author {
        _id
        username
        profilePhoto
      }
      postDate
      likes {
        _id
      }
      comments {
        _id
        text
        author {
          _id
          username
          profilePhoto
        }
      }
      recipe {
        _id
        glassware
        imageURL
        ingredients {
          name
          quantity
        }
        instructions
        name
        tags
      }
    }
  }
`;

export const GET_POST_LIKES_USERS = gql`
  query PostLikesUsers($postId: ID!) {
    postLikesUsers(postId: $postId) {
      _id
      username
      profilePhoto
    }
  }
`;

// query a signle post along with details
export const GET_SINGLE_POST = gql`
  query GetSinglePost($postId: ID!) {
    getSinglePost(postId: $postId) {
      postTitle
      postContent
      postImageURL
      postDate
      _id
      author {
        _id
        username
        profilePhoto
      }
      comments {
        author {
          _id
          username
          profilePhoto
        }
        text
      }
      recipe {
        _id
        glassware
        imageURL
        ingredients {
          name
          quantity
        }
        instructions
        name
        tags
      }
    }
  }
`;

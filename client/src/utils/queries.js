import { gql } from '@apollo/client';

export const QUERY_ME = gql`
query Me {
  me {
    _id
    cocktails {
      ingredients {
        name
        quantity
      }
      name
      instructions
      imageURL
      glassware
      tags
      _id
    }
    email
    username
    profilePhoto
    posts {
      _id
      postContent
      postImageURL
      postTitle
      postDate
      author {
        _id
        username
        profilePhoto
      }
      likes {
        _id
        username
        profilePhoto
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
        profilePhoto
      }
      likes {
        _id
        username
        profilePhoto
      }
    }
  }
}
`;

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

export const QUERY_POSTS = gql`
query Posts {
  posts {
    _id
    postTitle
    postContent
    postImageURL
    postDate
    likes {
      _id
      username
      profilePhoto
    }
    author {
      _id
      username
      profilePhoto
    }
  }
}
`;
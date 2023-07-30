import { gql } from "@apollo/client";

export const ADD_USER = gql`
  mutation addUser($username: String, $email: String, $password: String, $profilePhoto: String) {
    addUser(username: $username, email: $email, password: $password, profilePhoto: $profilePhoto) {
      token
      user {
        _id
        email
        username
        profilePhoto
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_COCKTAIL = gql`
  mutation AddCocktail($name: String!, $ingredients: [IngredientInput!]!, $imageURL: String!, $glassware: String!, $instructions: String!, $tags: [String!]!) {
    addCocktail(name: $name, ingredients: $ingredients, imageURL: $imageURL, glassware: $glassware, instructions: $instructions, tags: $tags) {
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

export const DELETE_COCKTAIL = gql`
  mutation DeleteCocktail($cocktailId: ID!) {
    deleteCocktail(cocktailId: $cocktailId) {
      _id
    }
  }
`;

export const EDIT_COCKTAIL = gql`
mutation EditCocktail($cocktailId: ID!, $name: String, $ingredients: [IngredientInput!], $imageURL: String, $glassware: String, $instructions: String, $tags: [String!]) {
  editCocktail(cocktailId: $cocktailId, name: $name, ingredients: $ingredients, imageURL: $imageURL, glassware: $glassware, instructions: $instructions, tags: $tags) {
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

export const ADD_POST = gql`
  mutation AddPost($postTitle: String!, $postContent: String!, $postImageURL: String!, $postDate: String!, $author: ID!) {
    addPost(postTitle: $postTitle, postContent: $postContent, postImageURL: $postImageURL, postDate: $postDate, author: $author) {
      _id
      postTitle
      postContent
      postImageURL
      postDate
      author {
        _id
        username
        email
      }
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId) {
      _id
    }
  }
`;

export const EDIT_PROFILE_PHOTO = gql`
  mutation EditProfilePhoto($profilePhoto: String!) {
    editProfilePhoto(profilePhoto: $profilePhoto) {
      _id
      username
      email
      profilePhoto
    }
  }
`;

export const ADD_LIKE = gql`
  mutation AddLike($postId: ID!) {
    addLike(postId: $postId)
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($postId: ID!, $text: String!) {
    addComment(postId: $postId, text: $text) {
      _id
      text
      author {
        _id
        username
      }
    }
  }
`;


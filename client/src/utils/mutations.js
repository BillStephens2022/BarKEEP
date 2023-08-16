import { gql } from "@apollo/client";

// add a new user (i.e. upon sign up/registration)
export const ADD_USER = gql`
  mutation addUser(
    $username: String
    $email: String
    $password: String
    $profilePhoto: String
  ) {
    addUser(
      username: $username
      email: $email
      password: $password
      profilePhoto: $profilePhoto
    ) {
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

// login a user
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

// add a new cocktail recipe
export const ADD_COCKTAIL = gql`
  mutation AddCocktail(
    $name: String!
    $ingredients: [IngredientInput!]!
    $imageURL: String!
    $glassware: String!
    $instructions: String!
    $tags: [String!]!
  ) {
    addCocktail(
      name: $name
      ingredients: $ingredients
      imageURL: $imageURL
      glassware: $glassware
      instructions: $instructions
      tags: $tags
    ) {
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

// delete a cocktail recipe
export const DELETE_COCKTAIL = gql`
  mutation DeleteCocktail($cocktailId: ID!) {
    deleteCocktail(cocktailId: $cocktailId) {
      _id
    }
  }
`;

// edit an existing cocktail recipe
export const EDIT_COCKTAIL = gql`
  mutation EditCocktail(
    $cocktailId: ID!
    $name: String
    $ingredients: [IngredientInput!]
    $imageURL: String
    $glassware: String
    $instructions: String
    $tags: [String!]
  ) {
    editCocktail(
      cocktailId: $cocktailId
      name: $name
      ingredients: $ingredients
      imageURL: $imageURL
      glassware: $glassware
      instructions: $instructions
      tags: $tags
    ) {
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

// add a new post
export const ADD_POST = gql`
  mutation AddPost(
    $postTitle: String!
    $postContent: String!
    $postImageURL: String!
    $postDate: String!
    $author: ID!
    $recipe: CocktailInput
  ) {
    addPost(
      postTitle: $postTitle
      postContent: $postContent
      postImageURL: $postImageURL
      postDate: $postDate
      author: $author
      recipe: $recipe
    ) {
      _id
      postTitle
      postContent
      postImageURL
      postDate
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
      author {
        _id
        username
        email
      }
    }
  }
`;

// delete an existing post
export const DELETE_POST = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId) {
      _id
    }
  }
`;

// edit the user's profile photo
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

// "like" a post
export const ADD_LIKE = gql`
  mutation AddLike($postId: ID!) {
    addLike(postId: $postId) {
      _id
      postTitle
      author {
        _id
        username
      }
    }
  }
`;

// add a comment to a post
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

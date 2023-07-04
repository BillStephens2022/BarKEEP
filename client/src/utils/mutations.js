import { gql } from "@apollo/client";

export const ADD_USER = gql`
  mutation addUser($username: String, $email: String, $password: String) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        email
        username
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
      name
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
  mutation AddPost($postTitle: String!, $postContent: String!, $postImageURL: String!, $author: ID!) {
    addPost(postTitle: $postTitle, postContent: $postContent, postImageURL: $postImageURL, author: $author) {
      _id
      postTitle
      postContent
      postImageURL
      author {
        _id
        username
        email
      }
    }
  }
`;


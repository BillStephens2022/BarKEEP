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

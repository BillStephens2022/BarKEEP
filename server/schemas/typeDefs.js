const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    cocktails: [Cocktail]
  }
  type Ingredient {
    name: String!
    quantity: String!
  }
  input IngredientInput {
    name: String!
    quantity: String!
  }
  type Cocktail {
    _id: ID!
    name: String!
    ingredients: [Ingredient!]!
    imageURL: String!
    glassware: String!
    instructions: String!
    tags: [String!]!
  }
  type Auth {
    token: ID
    user: User
  }
  type Query {
    me: User
    cocktails: [Cocktail]
  }
  type Mutation {
    addUser(username: String, email: String, password: String): Auth
    login(email: String, password: String): Auth
    addCocktail(
      name: String!, 
      ingredients: [IngredientInput!]!,
      imageURL: String!
      glassware: String!
      instructions: String!
      tags: [String!]!
    ) : Cocktail
    deleteCocktail(cocktailId: ID!): Cocktail
  }
`;

module.exports = typeDefs;

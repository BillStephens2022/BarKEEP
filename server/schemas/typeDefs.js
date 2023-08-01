const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    profilePhoto: String
    cocktails: [Cocktail]
    posts: [Post]
    likedPosts: [Post]
    
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


  type Post {
    _id: ID!
    postTitle: String!
    postContent: String!
    postImageURL: String
    postDate: String
    author: User
    likes: [User]
    
  }

  type Auth {
    token: ID
    user: User
  }

  type Query {
    me: User
    cocktails: [Cocktail]
    posts: [Post]
  }

  type Mutation {
    addUser(
      username: String
      email: String
      password: String
      profilePhoto: String
    ): Auth
    login(email: String, password: String): Auth
    addCocktail(
      name: String!
      ingredients: [IngredientInput!]!
      imageURL: String!
      glassware: String!
      instructions: String!
      tags: [String!]!
    ): Cocktail
    deleteCocktail(cocktailId: ID!): Cocktail
    editCocktail(
      cocktailId: ID!
      name: String
      ingredients: [IngredientInput!]
      imageURL: String
      glassware: String
      instructions: String
      tags: [String!]
    ): Cocktail
    addPost(
      postTitle: String!
      postContent: String!
      postImageURL: String
      postDate: String
      author: ID!
    ): Post
    deletePost(postId: ID!): Post
    editProfilePhoto(profilePhoto: String!): User
    addLike(postId: ID!): Post
    
  }
`;

module.exports = typeDefs;

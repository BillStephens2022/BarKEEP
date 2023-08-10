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
    comments: [Comment]
  }

  type Ingredient {
    name: String!
    quantity: String!
  }

  input IngredientInput {
    name: String!
    quantity: String!
  }

  input CocktailInput {
    _id: ID!
    name: String!
    glassware: String!
    imageURL: String!
    ingredients: [IngredientInput!]!
    instructions: String!
    tags: [String!]!
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

  type Comment {
    _id: ID!
    text: String!
    author: User
  }

  type Post {
    _id: ID!
    postTitle: String!
    postContent: String!
    postImageURL: String
    postDate: String
    author: User
    likes: [User]
    comments: [Comment]
    recipe: Cocktail
  }

  type Auth {
    token: ID
    user: User
  }

  type Query {
    me: User
    cocktails: [Cocktail]
    posts: [Post]
    postLikesUsers(postId: ID!): [User]
    getSinglePost(postId: ID!): Post
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
      recipe: CocktailInput
    ): Post
    deletePost(postId: ID!): Post
    editProfilePhoto(profilePhoto: String!): User
    addLike(postId: ID!): Post
    addComment(
      postId: ID!
      text: String!
    ): Comment
  }
`;

module.exports = typeDefs;

// Import the gql function from Apollo Server
const { gql } = require("apollo-server-express");

// Define GraphQL type definitions using the gql template literal
const typeDefs = gql`
  # Define the User type for user-related information
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
  # Define the Ingredient type for cocktail ingredients
  type Ingredient {
    name: String!
    quantity: String!
  }
  # Define input type for adding ingredients to a cocktail
  input IngredientInput {
    name: String!
    quantity: String!
  }
  # Define input type for adding a new cocktail
  input CocktailInput {
    _id: ID!
    name: String!
    glassware: String!
    imageURL: String!
    ingredients: [IngredientInput!]!
    instructions: String!
    tags: [String!]!
  }
  # Define the Cocktail type for cocktail-related information
  type Cocktail {
    _id: ID!
    name: String!
    ingredients: [Ingredient!]!
    imageURL: String!
    glassware: String!
    instructions: String!
    tags: [String!]!
  }
  #Define the Comment type for comments on posts
  type Comment {
    _id: ID!
    text: String!
    author: User
  }
  # Define the Post type for user-generated posts
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
  # Define the Auth type for authentication-related information
  type Auth {
    token: ID
    user: User
  }
  # Define available queries
  type Query {
    me: User
    cocktails: [Cocktail]
    posts: [Post]
    postLikesUsers(postId: ID!): [User]
    getSinglePost(postId: ID!): Post
  }
  # Define available mutations
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

// Export the typeDefs to be used in the Apollo Server
module.exports = typeDefs;

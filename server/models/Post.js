const { Schema, model } = require("mongoose");

// Define the schema for comments associated with a post
const commentSchema = new Schema({
  // Comment's unique identifier
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
    auto: true,
  },
  // Text content of the comment
  text: {
    type: String,
    required: true,
  },
  // Reference to the user who authored the comment
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// Define the schema for posts
const postSchema = new Schema({
   // Title of the post
  postTitle: {
    type: String,
    required: true,
  },
  // Content of the post
  postContent: {
    type: String,
    required: true,
  },
  // URL of the post's associated image ('secure_url' from Cloudinary)
  postImageURL: {
    type: String,
  },
  // Reference to the cocktail recipe associated with the post
  recipe: {
    type: Schema.Types.ObjectId,
    ref: "Cocktail",
  },
  // Date when the post was created
  postDate: {
    type: Date,
  },
  // Reference to the user who authored the post
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // List of users who have liked the post
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    }
  ],
   // List of comments associated with the post
  comments: [commentSchema],
  
});

// Create the Post model
const Post = model("Post", postSchema);

// Export the Post model
module.exports = Post;

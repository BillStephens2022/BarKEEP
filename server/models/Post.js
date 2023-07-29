const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const postSchema = new Schema({
  postTitle: {
    type: String,
    required: true,
  },
  postContent: {
    type: String,
    required: true,
  },
  postImageURL: {
    type: String,
  },
  postDate: {
    type: Date,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: [
    {
      type: Number,
      default: 0,
    }
  ],
  comments: [commentSchema],
});

const Post = model("Post", postSchema);

module.exports = Post;

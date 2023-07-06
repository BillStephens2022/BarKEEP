const { Schema, model } = require("mongoose");

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
});

const Post = model("Post", postSchema);

module.exports = Post;

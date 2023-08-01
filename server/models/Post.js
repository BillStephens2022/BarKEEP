const { Schema, model } = require("mongoose");

// const commentSchema = new Schema({
//   _id: {
//     type: Schema.Types.ObjectId,
//     required: true,
//     auto: true,
//   },
//   text: {
//     type: String,
//     required: true,
//   },
//   author: {
//     type: Schema.Types.ObjectId,
//     ref: "User",
//   },
// });

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
      type: Schema.Types.ObjectId,
      ref: "User",
    }
  ],
  // comments: [commentSchema],
});

const Post = model("Post", postSchema);

module.exports = Post;

const { Schema, model } = require("mongoose");
const moment = require('moment-timezone');

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
    default: moment().tz('UTC').toDate(), // Set default value to current UTC date
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Post = model("Post", postSchema);

module.exports = Post;

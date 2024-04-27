const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const replySchema = new Schema({
    name: { type: String, required: true },
    reply: { type: String, required: true }
  });
  
  const commentSchema = new Schema({
    username: { type: String, required: true },
    comment: { type: String, required: true },
    replies: [replySchema]
  });
  
  const postSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    comments: [commentSchema]
  });
  
  const Post = mongoose.model('Post', postSchema);
  
  module.exports = Post;
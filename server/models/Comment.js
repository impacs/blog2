const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const CommentSchema = new Schema({
    name: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] // Referencja do odpowiedzi na komentarz
  });
  

module.exports = mongoose.model('Comment', CommentSchema);
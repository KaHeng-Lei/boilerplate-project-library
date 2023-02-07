const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  comments: [String],
  title: { type: String, required: true },
});

const CommentModel = new mongoose.model("comments", commentSchema);

module.exports = { CommentModel };

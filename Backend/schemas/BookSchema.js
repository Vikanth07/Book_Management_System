const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const BookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  pdfFile: { type: mongoose.Schema.Types.ObjectId, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  progress: {
    type: Number,
    default: 0,
  },
  totalPages: {
    type: Number,
    default: 0,
  },
  isLiked: {
    type: Boolean,
    default: false,
  },
});

module.exports = { BookSchema };

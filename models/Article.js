const mongoose = require("mongoose");

const articleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["enable", "disable"],
    default: "enable",
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  thumbnail: {
    type: String,
  },
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;

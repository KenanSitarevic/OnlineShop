const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: [String],
    required: true,
  },
  image: {
    type: [String],
    // required: true,
  },
  available: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Article", ArticleSchema);

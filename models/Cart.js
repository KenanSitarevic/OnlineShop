const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  order: {
    type: [
      {
        seller: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        article: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Article",
        },
        qty: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

module.exports = mongoose.model("Cart", CartSchema);

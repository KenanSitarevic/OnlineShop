const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Order", OrderSchema);

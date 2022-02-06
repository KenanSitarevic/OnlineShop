const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String,
  },

  serviceOrShop: {
    type: Boolean,
  },

  status: {
    type: String,
    default: "Active",
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },

  rating: {
    type: [Number],
  },
  phoneNumber: {
    type: String,
  },
  address: {
    type: [{ String, String }],
  },
  category: {
    type: [String],
  },
});

module.exports = mongoose.model("User", UserSchema);

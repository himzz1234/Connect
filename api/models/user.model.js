const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      min: 6,
    },
    profilePicture: {
      type: String,
      default:
        "https://res.cloudinary.com/dzcein87k/image/upload/v1710528180/wf3bchcnelg6eo8wfhlm.png",
    },
    coverPicture: {
      type: String,
      default:
        "https://res.cloudinary.com/dzcein87k/image/upload/v1710605368/dckcdvwkl18cbl67zlwm.jpg",
    },
    googleId: {
      type: String,
    },
    followers: {
      type: Array,
      default: [],
    },
    following: { type: Array, default: [] },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      max: 50,
    },
    city: {
      type: String,
      max: 50,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

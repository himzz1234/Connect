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
        "https://cdn.charitocracy.org/wp-content/plugins/charitocracy-plugin/images/default.png?iv=941",
    },
    coverPicture: {
      type: String,
      default:
        "https://img.freepik.com/free-photo/gray-wall-textures-background_74190-4389.jpg",
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
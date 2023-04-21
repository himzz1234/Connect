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
      required: true,
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
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fstock.adobe.com%2Fsearch%3Fk%3Dplain%2520grey%2520backgrounds&psig=AOvVaw2anFL-jQukOE4VgBvwLkZz&ust=1681670205148000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCLi5j-zDrP4CFQAAAAAdAAAAABAE",
    },
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
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

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    sender: {
      type: String,
    },
    type: {
      type: String,
    },
    url: {
      type: String,
    },
    text: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Sent", "Read"],
    },
    img: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);

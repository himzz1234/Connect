const router = require("express").Router();
const Message = require("../models/message.model");
const { getConnectedUsers } = require("../utils/socket");
const Conversation = require("../models/conversation.model");

// ADD A MESSAGE
router.post("/", async (req, res) => {
  const io = req.app.get("io");
  const newMessage = new Message(req.body);

  try {
    const savedMessage = await newMessage.save();
    const conversation = await Conversation.findById(
      savedMessage.conversationId
    );

    const receiverId =
      conversation.receiver.toString() === savedMessage.sender
        ? conversation.sender.toString()
        : conversation.receiver.toString();

    const receiverSocketId = getConnectedUsers().find(
      (user) => user.userId === receiverId
    ).socketId;

    const { sender, type, text, url } = savedMessage;
    io.to(receiverSocketId).emit("getMessage", {
      sender,
      text,
      type,
      url,
    });
    res.status(200).json({ message: savedMessage });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET A MESSAGE
router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json(err);
  }
});

module.exports = router;

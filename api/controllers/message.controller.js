const Message = require("../models/message.model");
const { getConnectedUsers } = require("../utils/socketapi");
const Conversation = require("../models/conversation.model");

const postMessage = async (req, res) => {
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

    const receiverSocket = getConnectedUsers().find(
      (user) => user.userId === receiverId
    );

    const { sender, type, text, url } = savedMessage;

    if (receiverSocket) {
      io.to(receiverSocket.socketId).emit("getMessage", {
        sender,
        text,
        type,
        url,
      });
    }

    res.status(200).json({ message: savedMessage });
  } catch (err) {
    res.status(500).json(err);
  }
};

const fetchMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json(err);
  }
};

module.exports = {
  postMessage,
  fetchMessages,
};

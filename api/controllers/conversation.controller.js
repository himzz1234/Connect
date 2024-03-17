const Conversation = require("../models/conversation.model");

const createConversation = async (req, res) => {
  const conversation = await Conversation.find({
    $or: [
      {
        $and: [
          { receiver: req.body.receiverId },
          { sender: req.body.senderId },
        ],
      },

      {
        $and: [
          { receiver: req.body.senderId },
          { sender: req.body.receiverId },
        ],
      },
    ],
  });

  try {
    if (!conversation.length) {
      const newConversation = new Conversation({
        receiver: req.body.receiverId,
        sender: req.body.senderId,
      });

      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    } else res.status(403).json({ message: "Conversation already exists!" });
  } catch (err) {
    res.status(500).json(err);
  }
};

const fetchUserConversations = async (req, res) => {
  try {
    const conversation = await Conversation.find({
      $or: [{ receiver: req.params.userId }, { sender: req.params.userId }],
    })
      .populate("receiver")
      .populate("sender");
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  createConversation,
  fetchUserConversations,
};

const router = require("express").Router();
const Conversation = require("../models/conversation.model");

// New conversation

router.post("/", async (req, res) => {
  // const conversation = await Conversation.find({
  //   members: { $all: [req.body.receiverId, req.body.senderId] },
  // });

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
});

router.get("/:userId", async (req, res) => {
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
});

module.exports = router;

const router = require("express").Router();
const Conversation = require("../models/Conversation");

// New conversation

router.post("/", async (req, res) => {
  console.log(req.body.senderId, req.body.receiverId);
  const conversation = await Conversation.find({
    members: { $in: [req.body.receiverId] },
  });

  try {
    if (!conversation.length) {
      const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId],
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
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

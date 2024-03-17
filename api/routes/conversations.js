const {
  createConversation,
  fetchUserConversations,
} = require("../controllers/conversation.controller");
const router = require("express").Router();

// New conversation
router.post("/", createConversation);

router.get("/:userId", fetchUserConversations);

module.exports = router;

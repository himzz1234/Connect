const {
  createConversation,
  fetchUserConversations,
} = require("../controllers/conversation.controller");
const router = require("express").Router();

// CREATE A NEW CONVERSATION
router.post("/", createConversation);

// FETCH A USER'S CONVERSATION
router.get("/:userId", fetchUserConversations);

module.exports = router;

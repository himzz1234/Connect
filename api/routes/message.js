const router = require("express").Router();
const {
  postMessage,
  fetchMessages,
} = require("../controllers/message.controller");

// ADD A MESSAGE
router.post("/", postMessage);

// GET A MESSAGE
router.get("/:conversationId", fetchMessages);

module.exports = router;

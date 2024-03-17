const router = require("express").Router();
const {
  postComment,
  deleteComment,
  fetchPostComments,
} = require("../controllers/comment.controller");

router.post("/", postComment);
router.get("/:postId", fetchPostComments);
router.delete("/:commentId", deleteComment);

module.exports = router;

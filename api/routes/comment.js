const router = require("express").Router();
const {
  postComment,
  deleteComment,
  fetchPostComments,
} = require("../controllers/comment.controller");

// POST A COMMENT
router.post("/", postComment);

// FETCH COMMENTS RELATED TO A POST
router.get("/:postId", fetchPostComments);

// DELETE A COMMENT
router.delete("/:commentId", deleteComment);

module.exports = router;

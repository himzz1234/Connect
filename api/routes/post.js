const router = require("express").Router();
const {
  createPost,
  updatePost,
  deletePost,
  likePost,
  fetchPost,
  fetchTimelinePosts,
} = require("../controllers/post.controller");

// create a post
router.post("/", createPost);

// update a post
router.put(":/id", updatePost);

// delete a post
router.delete("/:id", deletePost);

// like a post
router.put("/:id/like", likePost);

// get a post
router.get(":/id", fetchPost);

// get timeline posts
router.get("/timeline/:userId", fetchTimelinePosts);

module.exports = router;

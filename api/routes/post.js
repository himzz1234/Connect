const router = require("express").Router();
const {
  createPost,
  updatePost,
  deletePost,
  likePost,
  fetchPost,
  fetchTimelinePosts,
} = require("../controllers/post.controller");

// CREATE A POST
router.post("/", createPost);

// UPDATE A POST
router.put(":/id", updatePost);

// DELETE A POST
router.delete("/:id", deletePost);

// LIKE/DISLIKE A POST
router.put("/:id/like", likePost);

// GET A POST
router.get(":/id", fetchPost);

// GET TIMELINE POSTS
router.get("/timeline/:userId", fetchTimelinePosts);

module.exports = router;

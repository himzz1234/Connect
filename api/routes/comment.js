const router = require("express").Router();
const Comment = require("../models/comment.model");

router.post("/", async (req, res) => {
  const newComment = new Comment(req.body);
  try {
    const savedComment = await newComment.save();
    await savedComment.populate("userId");

    res.status(200).json(savedComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:commentId", async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  try {
    if (req.body.userId == comment.userId) {
      await comment.deleteOne();
      res.status(200).json("The comment has been deleted!");
    } else res.status(403).json("You can delete only your comment");
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .sort({ createdAt: -1 })
      .populate("userId");

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

const Comment = require("../models/comment.model");

const postComment = async (req, res) => {
  const newComment = new Comment(req.body);
  try {
    const savedComment = await newComment.save();
    await savedComment.populate("userId");

    res.status(200).json(savedComment);
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  try {
    if (req.body.userId == comment.userId) {
      await comment.deleteOne();
      res.status(200).json("The comment has been deleted!");
    } else res.status(403).json("You can delete only your comment");
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const fetchPostComments = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).populate(
      "userId"
    );

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  postComment,
  deleteComment,
  fetchPostComments,
};

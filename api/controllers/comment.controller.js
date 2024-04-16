const Comment = require("../models/comment.model");

// POST A COMMENT
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

// DELETE A COMMENT
const deleteComment = async (req, res) => {
  const { id } = req.user;
  const comment = await Comment.findById(req.params.commentId);
  try {
    if (id == comment.userId) {
      await comment.deleteOne();
      res.status(200).json("The comment has been deleted!");
    } else res.status(403).json("You can delete only your comment");
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// FETCH COMMENTS RELATED TO A POST
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

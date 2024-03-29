const cloudinary = require("cloudinary").v2;
const Post = require("../models/post.model");
const User = require("../models/user.model");
const Comment = require("../models/comment.model");

const createPost = async (req, res) => {
  if (req.body.img) {
    const regex = /\/([^\/]+)$/;

    const match = req.body.img.match(regex);
    if (match) {
      url = cloudinary.url(match[1], { quality: "auto:best", secure: true });
      req.body.img = url;
    }
  }

  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    await savedPost.populate("userId");
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
};

const updatePost = async (req, res) => {
  try {
    const post = Post.findById(req.params.id);

    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("The post has been updated!");
    } else {
      res.status(403).json("You can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.userId == req.body.userId) {
      if (post.img) {
        const regex = /\/([^\/]+)$/;

        const match = post.img.match(regex);
        if (match) {
          const public_id = match[1].split(".")[0];
          await cloudinary.uploader.destroy(public_id);
        }
      }

      await post.deleteOne();
      await Comment.deleteMany({ postId: req.params.id });
      res.status(200).json("The post has been deleted!");
    } else {
      res.status(403).json("You can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const fetchPost = async (req, res) => {
  try {
    const post = Post.findById(req.params.id).populate("userId");
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
};

const fetchTimelinePosts = async (req, res) => {
  const pageNumber = parseInt(req.query.pageNumber) || 1;

  const postsPerPage = 3;
  const skipCount = (pageNumber - 1) * postsPerPage;

  try {
    const currentUser = await User.findById(req.params.userId);
    const allUsers = [currentUser._id.toString(), ...currentUser.following];

    const feedPosts = await Post.find({ userId: { $in: allUsers } })
      .skip(skipCount)
      .limit(postsPerPage)
      .sort({ createdAt: -1 })
      .populate("userId");

    const totalCount = await Post.find({
      userId: { $in: allUsers },
    }).countDocuments();

    res.status(200).json({ posts: [...feedPosts], length: totalCount });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  likePost,
  createPost,
  updatePost,
  deletePost,
  fetchPost,
  fetchTimelinePosts,
};

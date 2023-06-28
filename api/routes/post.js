const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");
const cloudinary = require("cloudinary").v2

// create a post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    await savedPost.populate("userId");
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update a post
router.put(":/id", async (req, res) => {
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
});

// delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.userId == req.body.userId) {          
      const regex = /\/([^\/]+)$/;

      const match = post.img.match(regex);
      if (match) {
        const public_id = match[1].split('.')[0];
        await cloudinary.uploader.destroy(public_id)
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
});

// like a post
router.put("/:id/like", async (req, res) => {
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
});

// get a post
router.get(":/id", async (req, res) => {
  try {
    const post = Post.findById(req.params.id).populate("userId");
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get timeline posts
router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id }).populate(
      "userId"
    );

    const feedPosts = await Promise.all(
      currentUser.following.map(async (fId) => {
        return await Post.find({ userId: fId }).populate("userId");
      })
    );

    res.status(200).json(userPosts.concat(...feedPosts));
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

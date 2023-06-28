const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2

// get all users
router.post("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users.filter((user) => user._id != req.body.userId));
  } catch (err) {
    res.status(500).json(err);
  }
});

// update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }

    let url = ''
    try {
      if(req.body.profilePicture){
        const regex = /\/([^\/]+)$/;

        const match = req.body.profilePicture.match(regex);
        if (match) {
          url = cloudinary.url(match[1], {quality: "auto:eco"})
          req.body.profilePicture = url
        }
      }

      if(req.body.coverPicture){
        const regex = /\/([^\/]+)$/;

        const match = req.body.coverPicture.match(regex);
        if (match) {
          url = cloudinary.url(match[1], {height: 400, quality: "auto:best"})
          req.body.coverPicture = url
          console.log(url)
        }
      }

      await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });

      res.status(200).json("Account has been updated!");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your userID");
  }
});

// delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      return res.status(200).json("Account has been deleted!");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your userID");
  }
});

// get a user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get friends of a user
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.following.map(async (fId) => {
        return User.findById(fId);
      })
    );

    let friendsList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendsList.push({ _id, username, profilePicture });
    });

    res.status(200).json(friendsList);
  } catch (err) {
    res.status(500).json(err);
  }
});

// follow a user
router.put("/follow/:id", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({
          $push: { following: req.params.id },
        });
        res.status(200).json("User has been followed!");
      } else {
        res.status(403).json("You already follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can't follow yourself");
  }
});

// unfollow a user
router.put("/unfollow/:id", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({
          $pull: { following: req.params.id },
        });
        res.status(200).json("User has been unfollowed!");
      } else {
        res.status(403).json("You don't follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can't unfollow yourself");
  }
});

module.exports = router;

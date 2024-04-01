const User = require("../models/user.model");
const cloudinary = require("cloudinary").v2;
const { client } = require("../db/redis");

// FETCH USERS
const fetchAllUsers = async (req, res) => {
  const searchTerm = req.query.searchTerm || "";
  try {
    const users = await User.find({
      _id: { $ne: req.body.userId },
      username: { $regex: searchTerm, $options: "i" },
    });

    res.status(200).json(users);
  } catch (err) {
    res.status(400).json(err);
  }
};

// UPDATE USER DETAILS
const updateUser = async (req, res) => {
  if (req.body.userId === req.params.id) {
    let url = "";
    try {
      if (req.body.profilePicture) {
        const regex = /\/([^\/]+)$/;

        const match = req.body.profilePicture.match(regex);
        if (match) {
          url = cloudinary.url(match[1], { quality: "auto:eco", secure: true });
          req.body.profilePicture = url;
        }
      }

      if (req.body.coverPicture) {
        const regex = /\/([^\/]+)$/;

        const match = req.body.coverPicture.match(regex);
        if (match) {
          url = cloudinary.url(match[1], {
            height: 400,
            quality: "auto:best",
            secure: true,
          });

          req.body.coverPicture = url;
        }
      }

      const updatedUser = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });

      const { password, updatedAt, ...other } = updatedUser._doc;

      await client.set(`user:${updatedUser._id}`, JSON.stringify(other));
      await client.expire(`user:${updatedUser._id}`, 300);

      res.status(200).json("Account has been updated!");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your userID");
  }
};

// DELETE A USER
const deleteUser = async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      return res.status(200).json("Account has been deleted!");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(401).json("You can only delete your account!");
  }
};

// FETCH USER DETAILS
const fetchUser = async (req, res) => {
  const { id } = req.params;
  try {
    const cacheValue = await client.get(`user:${id}`);
    if (cacheValue) {
      return res.status(200).json(JSON.parse(cacheValue));
    }

    const user = await User.findById(id);
    const { password, updatedAt, ...other } = user._doc;

    await client.set(`user:${id}`, JSON.stringify(other));
    await client.expire(`user:${id}`, 300);
    return res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
};

// FETCH A USER'S CONNECTIONS
const fetchConnections = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    const commonUserIds = user.following.reduce((common, user_id) => {
      if (user.followers.includes(user_id)) {
        common.push(user_id);
      }

      return common;
    }, []);

    const connections = await Promise.all(
      commonUserIds.map(async (id) => {
        return User.findById(id).select("_id username profilePicture");
      })
    );

    res.status(200).json(connections);
  } catch (err) {
    res.status(500).json(err);
  }
};

// FOLLOW A USER
const followUser = async (req, res) => {
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
};

// UNFOLLOW A USER
const unfollowUser = async (req, res) => {
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
};

module.exports = {
  fetchAllUsers,
  updateUser,
  deleteUser,
  fetchUser,
  fetchConnections,
  followUser,
  unfollowUser,
};

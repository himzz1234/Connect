const router = require("express").Router();
const {
  fetchAllUsers,
  updateUser,
  deleteUser,
  fetchUser,
  fetchConnections,
  followUser,
  unfollowUser,
} = require("../controllers/user.controller");

// GET ALL USERS
router.post("/", fetchAllUsers);

// UPDATE USER DETAILS
router.put("/:id", updateUser);

// DELETE USER
router.delete("/:id", deleteUser);

// GET USER DETAILS
router.get("/:id", fetchUser);

// GET USER CONNECTIONS
router.get("/friends/:userId", fetchConnections);

// FOLLOW A USER
router.put("/follow/:id", followUser);

// UNFOLLOW A USER
router.put("/unfollow/:id", unfollowUser);

module.exports = router;

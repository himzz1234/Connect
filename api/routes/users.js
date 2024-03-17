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

// get all users
router.post("/", fetchAllUsers);

// update user
router.put("/:id", updateUser);

// delete user
router.delete("/:id", deleteUser);

// get a user
router.get("/:id", fetchUser);

// get friends of a user
router.get("/friends/:userId", fetchConnections);

// follow a user
router.put("/follow/:id", followUser);

// unfollow a user
router.put("/unfollow/:id", unfollowUser);

module.exports = router;

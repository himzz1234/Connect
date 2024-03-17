const {
  createNotification,
  fetchUserNotifications,
  markNotificationsAsRead,
} = require("../controllers/notification.controller");
const router = require("express").Router();

router.post("/", createNotification);

router.get("/:id", fetchUserNotifications);

// Mark notifications as read
router.put("/:id", markNotificationsAsRead);

module.exports = router;

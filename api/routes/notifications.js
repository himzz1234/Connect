const {
  createNotification,
  fetchUserNotifications,
  markNotificationsAsRead,
} = require("../controllers/notification.controller");
const router = require("express").Router();

// CREATE A NOTIFICATION
router.post("/", createNotification);

// FETCH USER NOTIFICATIONS
router.get("/:id", fetchUserNotifications);

// MARK NOTIFICATIONS AS READ
router.put("/:id", markNotificationsAsRead);

module.exports = router;

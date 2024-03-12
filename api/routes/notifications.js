const Notification = require("../models/notification.model");
const { getConnectedUsers } = require("../utils/socket");
const router = require("express").Router();

router.post("/", async (req, res) => {
  const io = req.app.get("io");
  const receiverSocketId = getConnectedUsers().find(
    (user) => user.userId === req.body.receiver
  ).socketId;

  try {
    const newNotification = await Notification.create(req.body);

    const populatedNotification = await Notification.populate(newNotification, [
      { path: "sender", select: ["username", "profilePicture"] },
      { path: "post", select: ["desc", "img"] },
      { path: "comment", select: "text" },
    ]);

    console.log(newNotification, populatedNotification);
    io.to(receiverSocketId).emit("getNotification", populatedNotification);

    res.status(200).json(newNotification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const allNotifications = await Notification.find({
      receiver: id,
    })
      .sort({ createdAt: -1 })
      .populate({ path: "sender", select: ["username", "profilePicture"] })
      .populate({ path: "post", select: ["desc", "img"] })
      .populate({ path: "comment", select: "text" })
      .exec();

    res.status(200).json(allNotifications);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

// Mark notifications as read
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Notification.updateMany(
      { _id: { $in: req.body } },
      { $set: { isread: true } }
    );

    const notifications = await Notification.find({ receiver: id })
      .sort({ createdAt: -1 })
      .populate({ path: "sender", select: ["username", "profilePicture"] })
      .populate({ path: "post", select: ["desc", "img"] })
      .populate({ path: "comment", select: "text" })
      .exec();

    res.status(200).json(notifications);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

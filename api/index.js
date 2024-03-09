const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cloudinary = require("cloudinary").v2;
const passport = require("passport");
const cookieParser = require("cookie-parser");

const io = require("socket.io")(server, {
  perMessageDeflate: false,
  cors: {
    origin: "*",
  },
});

const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
const convRoutes = require("./routes/conversations");
const notifRoutes = require("./routes/notifications");
const messageRoutes = require("./routes/message");
const commentRoutes = require("./routes/comment");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// middlewares
app.use(passport.initialize());

require("./passport");
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
  })
);

app.use(express.json());
app.use(helmet());
app.use(cookieParser());

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);

    io.emit("getUsers", users);
  });

  // receive Notification
  socket.on("sendNotification", ({ sender, receiver, text, type }) => {
    const user = getUser(receiver._id);

    if (user) {
      io.to(user.socketId).emit("getNotification", {
        sender,
        text,
        type,
      });
    }
  });

  // send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text, type, url }) => {
    const user = getUser(receiverId);

    if (user) {
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
        type,
        url,
      });
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);

    io.emit("getUsers", users);
  });
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/conversation", convRoutes);
app.use("/api/notification", notifRoutes);

server.listen(8800, () => console.log("Server up and running⚡"));

const express = require("express");
const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  perMessageDeflate: false,
  cors: {
    origin: "http://localhost:3000",
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
const messageRoutes = require("./routes/message");
const commentRoutes = require("./routes/comment");
const multer = require("multer");

dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// middleware
app.use(cors());
app.use(express.json());
app.use(helmet());

const upload = multer();
app.post("api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploaded successfully");
  } catch (err) {
    console.log(err);
  }
});

app.get("/", (req, res) => {
  res.json("kokofekfe");
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/conversation", convRoutes);

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
  socket.on("sendNotification", ({ sender, receiver, type }) => {
    const user = getUser(receiver._id);
    io.to(user.socketId).emit("getNotification", {
      sender,
      type,
    });
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

server.listen(8800, () => console.log("Server up and running⚡"));

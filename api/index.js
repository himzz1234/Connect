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
const { initializeSocket } = require("./utils/socket");

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
    origin: ["http://localhost:300", "https://connectsocialmedia.onrender.com"],
    credentials: true,
  })
);

app.use(express.json());
app.use(helmet());
app.use(cookieParser());

initializeSocket(io);
app.set("io", io);

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/conversation", convRoutes);
app.use("/api/notification", notifRoutes);

server.listen(8800, () => console.log("Server up and running⚡"));

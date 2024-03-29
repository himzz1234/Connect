const express = require("express");
const app = express();
const cloudinary = require("cloudinary").v2;
const passport = require("passport");
const cookieParser = require("cookie-parser");

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
const { initializeSocket } = require("./utils/socketapi");

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

const corsOptions = {
  credentials: true,
};

if (process.env.NODE_ENV === "development") {
  corsOptions.origin = "http://localhost:3000";
} else if (process.env.NODE_ENV === "production") {
  corsOptions.origin = "https://connectsocialmedia.onrender.com";
}

app.use(cors(corsOptions));
app.set("trust proxy", 1);

app.use(express.json());
app.use(helmet());
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/conversation", convRoutes);
app.use("/api/notification", notifRoutes);

const server = app.listen(8800, () => {
  console.log("Server is up and running!");
  const io = require("socket.io")(server, {
    perMessageDeflate: false,
    cors: {
      origin: "*",
    },
  });

  initializeSocket(io);
  app.set("io", io);
});

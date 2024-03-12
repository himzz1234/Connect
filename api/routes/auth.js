const router = require("express").Router();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");

// GENERATE TOKEN
const generateToken = (id, username) => {
  const payload = {
    id,
    username,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });
  return token;
};

const generateCookie = (id, username, res) => {
  const token = `Bearer ${generateToken(id, username)}`;

  res.cookie("access_token", token, {
    // httpOnly: true,
    expires: new Date(Date.now() + 14 * 24 * 3600 * 1000),
    secure: true,
  });
};

// VERIFY TOKEN
const verifyJWT = (req, res, next) => {
  const token = req.cookies.access_token?.split(" ")[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(400).json({ message: err.message });
      }

      req.user = {};
      req.user.id = decoded.id;
      req.user.username = decoded.username;
      next();
    });
  } else {
    res.status(400).json({ message: "Incorrect Token Given!" });
  }
};

// GOOGLE SIGN IN
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "https://connectsocialmedia.onrender.com",
    session: false,
  }),
  (req, res) => {
    generateCookie(req.user._id, req.user.username, res);
    res.redirect("https://connectsocialmedia.onrender.com");
  }
);

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (!userExists) {
      // generate new password
      const salt = await bcrypt.genSalt(10); // a salt is random data that is used as an additional input to a one-way function that hashes data
      const hashedPassword = await bcrypt.hash(password, salt);

      // create a new user
      const newUser = User.create({
        username,
        email,
        password: hashedPassword,
      });

      generateCookie(newUser._id, newUser.username, res);
      res
        .status(200)
        .json({ message: "Successfully registered!", user: newUser });
    } else {
      res.status(403).json({ message: "User already exists!" });
    }
  } catch (err) {
    res.status(500).json({ message: "An error occured, Try again!" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      bcrypt.compare(req.body.password, user.password, (err, data) => {
        if (err) {
          res.status(403).json({ message: err.message });
        }

        if (data) {
          generateCookie(user._id, user.username, res);

          res.status(200).json({
            message: "Login Successfull!",
            user: user,
          });
        } else {
          res.status(403).json({ message: "Password doesn't match!" });
        }
      });
    } else {
      res.status(403).json({ message: "User not found!" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/logout", async (req, res) => {
  res.clearCookie("access_token");

  res.status(200).json({
    message: "Logout Successfull!",
  });
});

// GET USER
router.get("/getauth", verifyJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    console.log(user);
    res.status(200).json({ user: user });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

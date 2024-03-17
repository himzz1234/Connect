const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/nodemailer");

// GENERATE TOKEN
const generateToken = (id, username, expiry) => {
  const payload = {
    id,
    username,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiry || "30d",
  });

  return token;
};

const generateCookie = (id, username, rememberMe, res) => {
  const token = `${generateToken(id, username)}`;

  res.cookie("access_token", token, {
    httpOnly: false,
    expires: rememberMe ? new Date(Date.now() + 14 * 24 * 3600 * 1000) : null,
    secure: true,
    sameSite: "None",
  });
};

// REGISTER
const register = async (req, res) => {
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
        .status(201)
        .json({ message: "Successfully registered!", user: newUser });
    } else {
      res.status(409).json({ message: "User already exists!" });
    }
  } catch (err) {
    res.status(500).json({ message: "An error occured, Try again!" });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      bcrypt.compare(req.body.password, user.password, (err, data) => {
        if (err) {
          res.status(401).json({ message: err.message });
        }

        if (data) {
          generateCookie(user._id, user.username, req.body.rememberMe, res);

          res.status(200).json({
            message: "Login Successfull!",
            user: user,
          });
        } else {
          res.status(401).json({ message: "Password doesn't match!" });
        }
      });
    } else {
      res.status(401).json({ message: "User not found!" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const logout = async (req, res) => {
  res.clearCookie("access_token");

  res.status(200).json({
    message: "Logout Successfull!",
  });
};

// GET USER
const getAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ user: user });
  } catch (err) {
    res.status(401).json(err);
  }
};

// FORGOT PASSWORD
const sendResetMail = async (req, res) => {
  const { emailId } = req.body;

  const user = await User.findOne({ email: emailId });
  const url =
    "http://localhost:3000/resetpassword/" +
    generateToken(user._id, user.username, "10m");

  const body = `<div>
    <h2><a href="http://localhost:3000">Connect</a></h2>
    <p>Hi,</p>
    <p>you have requested to reset the password of your connect account</p>
    <p>Please click the link to reset your password</p>
    <a href=${url}>Reset Password</a>
  </div>`;

  try {
    if (user) {
      sendMail(user.email, "Reset Password", body);
      res.status(200).json({ message: "Email sent successfully!" });
    } else {
      res.status(401).json({ message: "Not valid credentials!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  const { password } = req.body;
  try {
    const user = await User.findById(req.user.id);

    if (password && user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await User.findOneAndUpdate(
        { _id: user._id },
        { password: hashedPassword }
      );

      res.status(200).json({ message: "Password successfully reset!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  resetPassword,
  sendResetMail,
  getAuth,
  logout,
  login,
  register,
};

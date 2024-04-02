const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const sendMail = require("../utils/nodemailer");
const { generateCookie, generateToken } = require("../utils/auth");
const { client } = require("../db/redis");

// REGISTER
const register = async (req, res) => {
  try {
    const { username, email, password: pass } = req.body;

    const userExists = await User.findOne({ email });
    if (!userExists) {
      // generate new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(pass, salt);

      // create a new user
      const newUser = User.create({
        username,
        email,
        password: hashedPassword,
      });

      const { password, updatedAt, ...data } = newUser;
      res.status(200).json({ message: "Successfully registered!", user: data });
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
    const user = await User.findOne({ email: req.body.email }).select(
      "-createdAt -updatedAt"
    );

    if (!user) {
      return res.status(401).json({ message: "User not found!" });
    }

    bcrypt.compare(req.body.password, user.password, async (err, data) => {
      if (err) {
        return res.status(401).json({ message: err.message });
      }

      if (data) {
        generateCookie(user._id, user.username, req.body.rememberMe, res);

        await client.set(`user:${user._id}`, JSON.stringify(user));
        await client.expire(`user:${user._id}`, 300);

        return res.status(200).json({
          message: "Login Successful!",
          user: user,
        });
      } else {
        return res.status(401).json({ message: "Password doesn't match!" });
      }
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

// LOGOUT
const logout = async (req, res) => {
  console.log(res.cookies);
  res.clearCookie("access_token", {
    httpOnly: false,
    secure: true,
    sameSite: "None",
  });

  res.status(200).json({
    message: "Logout Successfull!",
  });
};

// GET USER AUTH
const getAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -createdAt -updatedAt"
    );

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
    "https://letsconnect3.netlify.app/resetpassword/" +
    generateToken(user._id, user.username, "10m");

  const body = `<div>
    <h2><a href="https://letsconnect3.netlify.app">Connect</a></h2>
    <p>Hi,</p>
    <p>you have requested to reset the password of your connect account.</p>
    <p>Please click the link to reset your password.</p>
    <a href=${url}>Reset Password</a>
    <h3>Note: The link will expire in 10 minutes.</h3>
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

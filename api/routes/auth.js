const router = require("express").Router();
const passport = require("passport");
const {
  resetPassword,
  sendResetMail,
  getAuth,
  logout,
  login,
  register,
} = require("../controllers/auth.controller");
const verifyJWT = require("../middleware/userAuth");
const { generateCookie } = require("../lib/utils/auth");

// GOOGLE SIGN IN
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// GOOGLE CALLBACK AFTER SIGNIN
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "https://connecthere.vercel.app",
    session: false,
  }),
  (req, res) => {
    const rememberMe = false;
    generateCookie(req.user._id, req.user.username, rememberMe, res);
    res.redirect("https://connecthere.vercel.app");
  }
);

// REGISTER
router.post("/register", register);

// LOGIN
router.post("/login", login);

// LOGOUT
router.get("/logout", logout);

// GET USER
router.get("/getauth", verifyJWT, getAuth);

// FORGOT PASSWORD
router.post("/sendresetmail", sendResetMail);

// RESET PASSWORD
router.put("/resetpassword", verifyJWT, resetPassword);

module.exports = router;

const router = require("express").Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const {
  resetPassword,
  sendResetMail,
  getAuth,
  logout,
  login,
  register,
} = require("../controllers/auth.controller");

// VERIFY TOKEN
const verifyJWT = (req, res, next) => {
  const token = req.cookies.access_token || req.headers.access_token;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: "Unauthorized access!" });
      }

      req.user = {};
      req.user.id = decoded.id;
      req.user.username = decoded.username;
      next();
    });
  } else {
    res.status(401).json({ message: "Unauthorized access!" });
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

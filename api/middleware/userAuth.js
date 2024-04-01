const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const token = req.cookies.access_token || req.headers.access_token;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized access!" });
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

module.exports = verifyJWT;

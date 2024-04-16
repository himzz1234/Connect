const jwt = require("jsonwebtoken");

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

module.exports = {
  generateCookie,
  generateToken,
};

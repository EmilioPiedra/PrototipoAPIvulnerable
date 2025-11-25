const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      permiso: user._userInfo.rango,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
      algorithm: "HS256",
    }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };

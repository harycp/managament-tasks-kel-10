const { verifyToken } = require("../utils/jwt");

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Authentication Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = authenticate;

const { verifyToken } = require("../utils/jwt");

const authenticate = (req, res, next) => {
  try {
    // Ambil token dari cookie
    const token = req.cookies?.authToken;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // Verifikasi token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = authenticate;

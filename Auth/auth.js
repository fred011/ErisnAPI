const jwt = require("jsonwebtoken");

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        return res
          .status(401)
          .json({ success: false, message: "No token provided." });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (roles.length > 0 && !roles.includes(req.user.role)) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied." });
      }

      next();
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token." });
    }
  };
};

module.exports = authMiddleware;

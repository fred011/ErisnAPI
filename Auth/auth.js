const jwt = require("jsonwebtoken");

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    try {
      const authHeader = req.header("Authorization");
      if (!authHeader) {
        return res.status(401).json({ error: "Authorization header missing." });
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        return res.status(401).json({ error: "No token provided." });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (roles.length > 0 && !roles.includes(req.user.role)) {
        return res.status(403).json({ error: "Access denied." });
      }

      next();
    } catch (error) {
      console.error("Error decoding token:", error);
      res.status(401).json({ error: "Invalid token." });
    }
  };
};

module.exports = authMiddleware;

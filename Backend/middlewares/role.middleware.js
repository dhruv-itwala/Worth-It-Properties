export const requireRole =
  (...allowedRoles) =>
  (req, res, next) => {
    try {
      const user = req.user;
      if (!user)
        return res.status(401).json({ message: "Authentication required" });
      if (!allowedRoles.includes(user.role))
        return res.status(403).json({ message: "Insufficient permissions" });
      next();
    } catch (err) {
      res.status(500).json({ message: "Role validation failed" });
    }
  };

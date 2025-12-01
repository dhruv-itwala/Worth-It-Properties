// middlewares/role.middleware.js

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user)
        return res
          .status(401)
          .json({ message: "User authentication required" });

      if (!allowedRoles.includes(user.role))
        return res
          .status(403)
          .json({ message: "Access denied: insufficient permissions" });

      next();
    } catch (err) {
      return res.status(500).json({ message: "Role validation failed" });
    }
  };
};

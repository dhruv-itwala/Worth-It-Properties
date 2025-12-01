// middlewares/adminAuth.middleware.js
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.model.js";

export const adminAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.admin_token;
    if (!token)
      return res.status(401).json({ message: "Admin authentication required" });

    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    const admin = await Admin.findById(decoded.adminId);
    if (!admin) return res.status(401).json({ message: "Admin not found" });
    if (admin.banned) return res.status(403).json({ message: "Admin banned" });

    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired admin token" });
  }
};

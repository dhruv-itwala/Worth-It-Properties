import jwt from "jsonwebtoken";
import Admin from "../models/Admin.model.js";
import AdminService from "../services/admin.service.js";

class AdminController {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).json({ message: "Email and password required" });

      const admin = await Admin.findOne({ email }).select("+password");
      if (!admin)
        return res.status(401).json({ message: "Invalid credentials" });

      const isMatch = await admin.comparePassword(password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid credentials" });

      const payload = { adminId: admin._id, role: admin.role };
      const token = jwt.sign(payload, process.env.ADMIN_JWT_SECRET, {
        expiresIn: process.env.ADMIN_JWT_EXPIRES_IN || "8h",
      });

      res.cookie("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 8,
        sameSite: "lax",
      });

      res.json({
        success: true,
        admin: { email: admin.email, role: admin.role },
      });
    } catch (err) {
      console.error("ADMIN LOGIN:", err);
      res.status(500).json({ message: err.message });
    }
  }

  async getMe(req, res) {
    res.json({
      success: true,
      admin: {
        id: req.admin._id,
        email: req.admin.email,
        role: req.admin.role,
      },
    });
  }

  async logout(req, res) {
    res.clearCookie("admin_token");
    res.json({ success: true, message: "Admin logged out" });
  }

  // ------------------ USER MANAGEMENT ------------------

  async listUsers(req, res) {
    try {
      const users = await AdminService.listUsers();
      res.json({ success: true, users });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async updateUser(req, res) {
    try {
      const userId = req.params.id;
      const updates = req.body;

      const user = await AdminService.updateUserRole(userId, updates);
      res.json({ success: true, user });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const userId = req.params.id;
      await AdminService.deleteUser(userId);
      res.json({ success: true, message: "User deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default new AdminController();

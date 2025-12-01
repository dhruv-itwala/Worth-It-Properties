// controllers/admin.controller.js
import jwt from "jsonwebtoken";
import AdminService from "../services/admin.service.js";
import Admin from "../models/Admin.model.js";

class AdminController {
  // Admin Login
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).json({ message: "Email and password required" });

      const admin = await Admin.findOne({ email });
      if (!admin)
        return res.status(401).json({ message: "Invalid credentials" });
      if (admin.banned)
        return res.status(403).json({ message: "Admin banned" });

      const isMatch = await admin.comparePassword(password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid credentials" });

      // sign admin token with ADMIN_JWT_SECRET
      const payload = { adminId: admin._id, role: admin.role };
      const token = jwt.sign(payload, process.env.ADMIN_JWT_SECRET, {
        expiresIn: process.env.ADMIN_JWT_EXPIRES_IN || "8h",
      });

      // set as httpOnly cookie named admin_token
      res.cookie("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 8, // 8 hours (or match env)
        sameSite: "lax",
      });

      return res.json({
        success: true,
        admin: { email: admin.email, role: admin.role },
      });
    } catch (err) {
      console.error("ADMIN LOGIN:", err);
      return res.status(500).json({ message: err.message || "Server error" });
    }
  }

  // Admin logout (clear cookie)
  async logout(req, res) {
    res.clearCookie("admin_token");
    res.json({ success: true, message: "Admin logged out" });
  }

  // GET /admin/users
  async listUsers(req, res) {
    try {
      const users = await AdminService.listUsers();
      res.json({ success: true, users });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // PUT /admin/users/:id  -> change role / ban/unban
  async updateUser(req, res) {
    try {
      const userId = req.params.id;
      const { role, ban } = req.body;
      const updated = await AdminService.updateUserRole(userId, { role, ban });
      res.json({ success: true, user: updated });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // DELETE /admin/users/:id
  async deleteUser(req, res) {
    try {
      const deleted = await AdminService.deleteUser(req.params.id);
      res.json({ success: true, deleted });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // GET /admin/properties
  async listProperties(req, res) {
    try {
      const properties = await AdminService.listProperties();
      res.json({ success: true, properties });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // PUT /admin/properties/:id
  async updateProperty(req, res) {
    try {
      const updated = await AdminService.updateProperty(
        req.params.id,
        req.body
      );
      res.json({ success: true, property: updated });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // PUT /admin/properties/:id/publish
  async publishProperty(req, res) {
    try {
      // toggle or set based on body.publish boolean
      const publish =
        req.body.publish === undefined ? true : !!req.body.publish;
      const updated = await AdminService.publishProperty(
        req.params.id,
        publish
      );
      res.json({ success: true, property: updated });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // DELETE /admin/properties/:id
  async deleteProperty(req, res) {
    try {
      const deleted = await AdminService.deleteProperty(req.params.id);
      res.json({ success: true, deleted });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default new AdminController();

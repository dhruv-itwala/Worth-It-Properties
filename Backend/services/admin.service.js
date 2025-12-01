// services/admin.service.js
import Admin from "../models/Admin.model.js";
import User from "../models/User.model.js";
import Property from "../models/Property.model.js";
import { generateToken } from "../utils/generateToken.js";

class AdminService {
  // Create an admin (useful for seeding)
  async createAdmin({ email, password }) {
    const exists = await Admin.findOne({ email });
    if (exists) throw new Error("Admin already exists");
    const admin = await Admin.create({ email, password });
    return admin;
  }

  async login(email, password) {
    const admin = await Admin.findOne({ email });
    if (!admin) throw new Error("Invalid credentials");
    if (admin.banned) throw new Error("Admin is banned");

    const ok = await admin.comparePassword(password);
    if (!ok) throw new Error("Invalid credentials");

    // generate admin token (use ADMIN_JWT_SECRET inside generateToken call)
    const token = generateToken(
      admin._id,
      process.env.ADMIN_JWT_EXPIRES_IN || "8h"
    );
    // NOTE: generateToken uses process.env.JWT_SECRET by default.
    // For admin we will sign with ADMIN_JWT_SECRET in controller to keep service generic.
    return admin;
  }

  async listUsers() {
    return User.find().select("-__v");
  }

  async updateUserRole(userId, updates) {
    const { role, ban } = updates;
    const updateObj = {};
    if (role) updateObj.role = role;
    if (ban !== undefined) updateObj.banned = !!ban;
    const user = await User.findByIdAndUpdate(userId, updateObj, { new: true });
    return user;
  }

  async deleteUser(userId) {
    return await User.findByIdAndDelete(userId);
  }

  async listProperties() {
    return Property.find().populate("postedBy", "name email");
  }

  async updateProperty(propertyId, updates) {
    return Property.findByIdAndUpdate(propertyId, updates, { new: true });
  }

  async publishProperty(propertyId, publish = true) {
    // We'll use a 'published' flag on property (if not exist, we add it)
    return Property.findByIdAndUpdate(
      propertyId,
      { published: publish },
      { new: true }
    );
  }

  async deleteProperty(propertyId) {
    return Property.findByIdAndDelete(propertyId);
  }
}

export default new AdminService();

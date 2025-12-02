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

  async listUsers() {
    return User.find().select("-__v");
  }

  async updateUserRole(userId, updates) {
    const { role } = updates;
    const updateObj = {};
    if (role) updateObj.role = role;
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

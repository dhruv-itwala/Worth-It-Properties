import User from "../models/User.model.js";
import cloudinary from "../config/cloudinary.config.js";
import sharp from "sharp";
import { hashPassword } from "../utils/encryption.js";

class UserService {
  async getUserById(id) {
    return User.findById(id).select("-googleId -__v");
  }

  async completeProfile(userId, data) {
    const {
      name,
      phone,
      whatsappNumber,
      gender,
      about,
      companyName,
      companyWebsite,
      experienceYears,
      businessName,
      reraId,
      role,
      city,
      state,
      area,
      fileBuffer,
      password,
    } = data;

    const updateData = {
      name,
      phone,
      whatsappNumber,
      gender,
      about,
      companyName,
      companyWebsite,
      experienceYears,
      businessName,
      reraId,
      city,
      state,
      area,
      profileCompleted: true,
    };

    // ----- ROLE UPDATE -----
    if (role && ["buyer", "owner", "builder", "broker"].includes(role)) {
      updateData.role = role;
    }

    // ----- IMAGE UPLOAD -----
    if (fileBuffer) {
      const optimized = await sharp(fileBuffer)
        .resize(300)
        .webp({ quality: 80 })
        .toBuffer();

      const uploadRes = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "worthit/users" }, (err, result) =>
            err ? reject(err) : resolve(result)
          )
          .end(optimized);
      });

      updateData.profilePhoto = uploadRes.secure_url;
    }

    // ----- PASSWORD CHANGE (optional) -----
    if (password) {
      updateData.password = await hashPassword(password);
    }

    return User.findByIdAndUpdate(userId, updateData, { new: true });
  }
}

export default new UserService();

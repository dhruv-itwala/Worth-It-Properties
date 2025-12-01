// services/user.service.js
import User from "../models/User.model.js";
import cloudinary from "../config/cloudinary.config.js";
import sharp from "sharp";

class UserService {
  async getUserById(id) {
    return await User.findById(id).select("-googleId -__v");
  }

  async completeProfile(userId, data) {
    const { name, phone, role, city, area } = data;

    return await User.findByIdAndUpdate(
      userId,
      {
        name,
        phone,
        role,
        city,
        area,
        profileCompleted: true,
      },
      { new: true }
    );
  }

  async updateProfilePhoto(userId, file) {
    if (!file) throw new Error("Image file required");

    // Optimize with sharp from BUFFER (not path)
    const optimizedBuffer = await sharp(file.buffer)
      .resize(300)
      .webp({ quality: 80 })
      .toBuffer();

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "worthit/users" }, (err, res) => {
          if (err) reject(err);
          else resolve(res);
        })
        .end(optimizedBuffer);
    });

    const user = await User.findByIdAndUpdate(
      userId,
      { profilePhoto: result.secure_url },
      { new: true }
    );

    return user;
  }
}

export default new UserService();

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

  async updateProfilePhoto(userId, filePath) {
    const optimizedImage = await sharp(filePath)
      .resize(300)
      .jpeg({ quality: 70 })
      .toBuffer();

    const uploadRes = await cloudinary.uploader.upload_stream({
      resource_type: "image",
      folder: "worthit/users",
    });

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "worthit/users" },
        async (error, result) => {
          if (error) return reject(error);

          const user = await User.findByIdAndUpdate(
            userId,
            { profilePhoto: result.secure_url },
            { new: true }
          );

          resolve(user);
        }
      );
      stream.end(optimizedImage);
    });
  }
}

export default new UserService();

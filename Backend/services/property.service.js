// services/property.service.js
import Property from "../models/Property.model.js";
import cloudinary from "../config/cloudinary.config.js";
import { compressImage, compressVideo } from "../config/compression.config.js";
import fs from "fs/promises";

class PropertyService {
  async create(userId, data, files) {
    const { images = [], video = [] } = files;

    const imageUrls = [];
    // CLEAN BODY DATA
    for (const key in data) {
      if (Array.isArray(data[key])) {
        data[key] = data[key][0];
      }
    }

    const numericFields = ["latitude", "longitude", "price", "bhk", "areaSqFt"];
    numericFields.forEach((f) => {
      if (data[f] !== undefined) data[f] = Number(data[f]);
    });

    // ----------------------------
    // COMPRESS + UPLOAD IMAGES
    // ----------------------------
    for (const img of images) {
      const compressedPath = await compressImage(img.path);

      const uploaded = await cloudinary.uploader.upload(compressedPath, {
        folder: "worthit/properties/images",
        resource_type: "image",
      });

      imageUrls.push(uploaded.secure_url);

      await fs.unlink(compressedPath);
    }

    // ----------------------------
    // COMPRESS + UPLOAD VIDEO
    // ----------------------------
    let videoUrl = "";
    if (video[0]) {
      const compressedVideoPath = await compressVideo(video[0].path);

      const uploadedVideo = await cloudinary.uploader.upload(
        compressedVideoPath,
        {
          folder: "worthit/properties/videos",
          resource_type: "video",
        }
      );

      videoUrl = uploadedVideo.secure_url;
      await fs.unlink(compressedVideoPath);
    }

    // ----------------------------
    // SAVE IN DATABASE
    // ----------------------------
    const property = await Property.create({
      ...data,
      postedBy: userId,
      images: imageUrls,
      video: videoUrl,
    });

    return property;
  }

  async getAll({ page = 1, limit = 12 }) {
    const skip = (page - 1) * limit;

    const properties = await Property.find({ published: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Property.countDocuments({ published: true });

    return { properties, total };
  }

  async getOne(id) {
    const property = await Property.findById(id).populate(
      "postedBy",
      "name phone whatsappNumber profilePhoto"
    );
    if (!property) return null;

    property.views++;
    await property.save();

    return property;
  }

  async getUserProperties(userId) {
    return Property.find({ postedBy: userId }).sort({ createdAt: -1 });
  }

  async update(id, userId, data) {
    return Property.findOneAndUpdate({ _id: id, postedBy: userId }, data, {
      new: true,
    });
  }

  async delete(id, userId) {
    return Property.findOneAndDelete({ _id: id, postedBy: userId });
  }
}

export default new PropertyService();

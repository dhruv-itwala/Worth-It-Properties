// services/property.service.js
import Property from "../models/Property.model.js";
import cloudinary from "../config/cloudinary.config.js";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import os from "os";
import { promisify } from "util";
import { v4 as uuidv4 } from "uuid";

let ffprobe;
try {
  // lazy require so package isn't mandatory unless you use ffprobe
  // you must have ffmpeg/ffprobe installed and available in PATH for this to work
  // optional: npm i fluent-ffmpeg
  // NOTE: fluent-ffmpeg will be required only if ffprobe will be used
  // We'll dynamically import when needed to avoid crashes if not installed.
  // ffprobe will be called via fluent-ffmpeg's ffprobe
} catch (e) {
  // ignore
}

const CLOUDINARY_IMG_FOLDER =
  process.env.CLOUDINARY_IMG_FOLDER || "worthit/properties/images";
const CLOUDINARY_VIDEO_FOLDER =
  process.env.CLOUDINARY_VIDEO_FOLDER || "worthit/properties/videos";

const MAX_IMAGE_COUNT = Number(process.env.MAX_IMAGE_COUNT) || 8;
const MIN_IMAGE_COUNT = Number(process.env.MIN_IMAGE_COUNT) || 1;
const MAX_IMAGE_MB = Number(process.env.MAX_IMAGE_MB) || 5; // per-image soft limit (MB)
const MAX_VIDEO_MB = Number(process.env.MAX_VIDEO_MB) || 10; // max video size (MB)
const MAX_VIDEO_DURATION_SEC =
  Number(process.env.MAX_VIDEO_DURATION_SEC) || 120; // 2 minutes default

class PropertyService {
  // Upload array of image file objects (from multer memoryStorage)
  async uploadImages(files) {
    if (!Array.isArray(files)) return [];

    const uploadedUrls = [];

    if (files.length < MIN_IMAGE_COUNT || files.length > MAX_IMAGE_COUNT) {
      throw new Error(
        `Images count must be between ${MIN_IMAGE_COUNT} and ${MAX_IMAGE_COUNT}`
      );
    }

    for (const file of files) {
      // Validate size (soft)
      const mb = file.size / (1024 * 1024);
      if (mb > MAX_IMAGE_MB) {
        throw new Error(
          `Each image must be <= ${MAX_IMAGE_MB} MB (one file is ${mb.toFixed(
            2
          )} MB)`
        );
      }

      // Use sharp on buffer
      // Resize to a max width of 1200 px while preserving aspect ratio
      const optimizedBuffer = await sharp(file.buffer)
        .rotate() // auto-orient
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 80 }) // webp gives better compression; Cloudinary will accept webp
        .toBuffer();

      // Cloudinary upload via upload_stream
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: CLOUDINARY_IMG_FOLDER, resource_type: "image" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(optimizedBuffer);
      });

      uploadedUrls.push(result.secure_url);
    }

    return uploadedUrls;
  }

  // Upload video: will optionally write temp file, check duration via ffprobe if available,
  // then upload to Cloudinary as video
  async uploadVideo(file) {
    if (!file) return null;

    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > MAX_VIDEO_MB) {
      throw new Error(`Video must be smaller than ${MAX_VIDEO_MB} MB`);
    }

    // Write temp file (required for ffprobe or cloudinary uploader file path)
    const tmpDir = os.tmpdir();
    const tmpName = `worthit-video-${Date.now()}-${uuidv4()}${
      path.extname(file.originalname) || ".mp4"
    }`;
    const tmpPath = path.join(tmpDir, tmpName);
    fs.writeFileSync(tmpPath, file.buffer);

    // Optional duration check using fluent-ffmpeg (ffprobe)
    let durationSec = null;
    try {
      // dynamic import to avoid hard dependency unless used
      const ffmpeg = await import("fluent-ffmpeg");
      // if ffmpeg is available, ffprobe will run (ffmpeg binary must be installed)
      const ffprobeProm = promisify(ffmpeg.default.ffprobe);
      const info = await ffprobeProm(tmpPath);
      durationSec = info.format.duration;
      if (
        durationSec &&
        MAX_VIDEO_DURATION_SEC &&
        durationSec > MAX_VIDEO_DURATION_SEC
      ) {
        fs.unlinkSync(tmpPath);
        throw new Error(
          `Video duration must be <= ${MAX_VIDEO_DURATION_SEC} seconds (got ${Math.round(
            durationSec
          )}s)`
        );
      }
    } catch (err) {
      // If fluent-ffmpeg/ffprobe is not available, skip duration check but log notice
      // (We will not block upload; we already validated size)
      // console.warn("ffprobe unavailable or error checking duration - skipping duration check", err.message);
    }

    // Upload to Cloudinary (resource_type: video)
    const uploadRes = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        tmpPath,
        { resource_type: "video", folder: CLOUDINARY_VIDEO_FOLDER },
        (err, result) => {
          // cleanup temp file
          try {
            fs.unlinkSync(tmpPath);
          } catch (e) {}
          if (err) return reject(err);
          resolve(result);
        }
      );
    });

    return uploadRes.secure_url;
  }

  // Create property, images: array of multer files, video: single multer file
  async createProperty(data, userId, imageFiles = [], videoFile = null) {
    // Validate images count again
    if (!imageFiles || imageFiles.length < MIN_IMAGE_COUNT) {
      throw new Error(`You must upload at least ${MIN_IMAGE_COUNT} images`);
    }

    const images = await this.uploadImages(imageFiles);
    const video = await this.uploadVideo(videoFile);

    const property = await Property.create({
      title: data.title,
      description: data.description || "",
      price: data.price,
      bhk: data.bhk,
      propertyType: data.propertyType,
      areaSqFt: data.areaSqFt,
      furnishing: data.furnishing,
      status: data.status,
      city: data.city,
      locality: data.locality,
      latitude: data.latitude,
      longitude: data.longitude,
      images,
      video,
      postedBy: userId,
    });

    return property;
  }

  async getAll(page, limit) {
    const skip = (page - 1) * limit;

    const properties = await Property.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("postedBy", "name email");

    const count = await Property.countDocuments();

    return { properties, count };
  }

  async getById(id) {
    return await Property.findById(id).populate("postedBy", "name email");
  }

  async getByUser(userId) {
    return await Property.find({ postedBy: userId }).sort({ createdAt: -1 });
  }

  async updateProperty(id, userId, data) {
    return await Property.findOneAndUpdate(
      { _id: id, postedBy: userId },
      data,
      { new: true }
    );
  }

  async deleteProperty(id, userId) {
    return await Property.findOneAndDelete({ _id: id, postedBy: userId });
  }
}

export default new PropertyService();

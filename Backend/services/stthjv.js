// services/property.service.js
import Property from "../models/Property.model.js";
import cloudinary from "../config/cloudinary.config.js";
import { compressImage, compressVideo } from "../config/compression.config.js";
import fs from "fs/promises";

function hrTimeMs(start) {
  const diff = process.hrtime(start);
  return (diff[0] * 1e3 + diff[1] / 1e6).toFixed(3) + "ms";
}

function safeParseJSONMaybe(val) {
  if (!val) return undefined;
  if (typeof val === "object") return val;
  try {
    return JSON.parse(val);
  } catch (e) {
    return val;
  }
}

function extractPublicIdFromUrl(url = "") {
  if (!url) return null;
  try {
    const parts = url.split("/upload/")[1];
    if (!parts) return null;
    // remove the version token (vXXX)
    const afterVersion = parts.split("/").slice(1).join("/");
    const lastDot = afterVersion.lastIndexOf(".");
    return lastDot === -1 ? afterVersion : afterVersion.substring(0, lastDot);
  } catch (e) {
    return null;
  }
}

class PropertyService {
  // ---------- CREATE ----------
  async create(userId, data = {}, files = {}) {
    const t0 = process.hrtime();

    const images = files.images || [];
    const videoArr = files.video || [];

    // sanitize
    const cleaned = { ...data };
    if (cleaned.amenities) {
      cleaned.amenities = safeParseJSONMaybe(cleaned.amenities);
      if (!Array.isArray(cleaned.amenities)) cleaned.amenities = [];
    }

    const numericFields = [
      "latitude",
      "longitude",
      "price",
      "bhk",
      "areaSqFt",
      "bathrooms",
      "floor",
      "totalFloors",
    ];
    numericFields.forEach((f) => {
      if (cleaned[f] !== undefined && cleaned[f] !== "")
        cleaned[f] = Number(cleaned[f]);
      else delete cleaned[f];
    });

    // basic guards
    if (images.length > 8) {
      await Promise.all(images.map((f) => fs.unlink(f.path).catch(() => {})));
      throw { status: 400, message: "Maximum 8 images allowed" };
    }
    if (videoArr[0] && videoArr[0].size > 12 * 1024 * 1024) {
      await Promise.all(images.map((f) => fs.unlink(f.path).catch(() => {})));
      await fs.unlink(videoArr[0].path).catch(() => {});
      throw { status: 400, message: "Video file too large. Max 10-12MB raw." };
    }

    console.log("[BACKEND] START CREATE:", hrTimeMs(t0));

    // 1) Compress images in parallel (map -> compressImage). compressImage should return path
    const tCompressStart = process.hrtime();
    const compressPromises = images.map((img, idx) =>
      compressImage(img.path).then((compressedPath) => ({
        compressedPath,
        idx,
        origPath: img.path,
      }))
    );
    const compressedResults = await Promise.all(compressPromises);
    console.log("[BACKEND] ALL_IMAGES_COMPRESSED:", hrTimeMs(tCompressStart));

    // 2) Upload images to Cloudinary in parallel
    const uploadedImages = [];
    const tUploadImagesStart = process.hrtime();
    try {
      const uploadPromises = compressedResults.map(
        async ({ compressedPath, idx }) => {
          // upload - use resource_type image and store only one optimized asset (Cloudinary can derive variants later)
          const res = await cloudinary.uploader.upload(compressedPath, {
            folder: "worthit/properties/images",
            resource_type: "image",
            // you can request format:webp or rely on upload being webp already from your compressImage
            // eager transformations are possible but cost transforms; prefer client-side transformations.
          });
          // collect metadata for cleanup if needed
          uploadedImages.push({
            url: res.secure_url,
            public_id: res.public_id,
          });
          // remove local compressed file asap
          await fs.unlink(compressedPath).catch(() => {});
          console.log(
            `[BACKEND] IMG_${idx + 1}_UPLOAD: ${hrTimeMs(tUploadImagesStart)}`
          );
          return res;
        }
      );

      await Promise.all(uploadPromises);
      console.log(
        "[BACKEND] ALL_IMAGE_UPLOADS_DONE:",
        hrTimeMs(tUploadImagesStart)
      );
    } catch (err) {
      // cleanup local compressed files and throw
      await Promise.all(
        compressedResults.map((r) =>
          fs.unlink(r.compressedPath).catch(() => {})
        )
      );
      console.error("[BACKEND] IMAGE UPLOAD FAILED:", err);
      throw err;
    }

    // 3) Video compress + upload (do serially after images to reduce concurrency resource spikes).
    let uploadedVideoUrl = "";
    if (videoArr[0]) {
      const tVidStart = process.hrtime();
      try {
        const compressedVideoPath = await compressVideo(videoArr[0].path);
        console.log("[BACKEND] VIDEO_COMPRESS:", hrTimeMs(tVidStart));
        const videoUploadStart = process.hrtime();
        const vres = await cloudinary.uploader.upload(compressedVideoPath, {
          folder: "worthit/properties/videos",
          resource_type: "video",
        });
        uploadedVideoUrl = vres.secure_url;
        console.log("[BACKEND] VIDEO_UPLOAD:", hrTimeMs(videoUploadStart));
        await fs.unlink(compressedVideoPath).catch(() => {});
      } catch (err) {
        console.error("[BACKEND] VIDEO UPLOAD FAILED:", err);
        // attempt cleanup of uploaded images (best-effort)
        for (const up of uploadedImages) {
          if (up.public_id)
            await cloudinary.uploader
              .destroy(up.public_id, { resource_type: "image" })
              .catch(() => {});
        }
        throw err;
      } finally {
        // remove original raw video
        await fs.unlink(videoArr[0].path).catch(() => {});
      }
    }

    // 4) Create DB entity
    const tDbStart = process.hrtime();
    try {
      const imagesForDB = uploadedImages.map((u) => u.url);
      const property = await Property.create({
        ...cleaned,
        postedBy: userId,
        images: imagesForDB,
        video: uploadedVideoUrl,
      });
      console.log("[BACKEND] DB_SAVE:", hrTimeMs(tDbStart));
      console.log("[BACKEND] TOTAL_CREATE_TIME:", hrTimeMs(t0));
      return property;
    } catch (err) {
      // cleanup cloudinary uploaded resources if DB save failed
      for (const up of uploadedImages) {
        const pid = up.public_id || extractPublicIdFromUrl(up.url);
        if (pid)
          await cloudinary.uploader
            .destroy(pid, { resource_type: "image" })
            .catch(() => {});
      }
      if (uploadedVideoUrl) {
        const pid = extractPublicIdFromUrl(uploadedVideoUrl);
        if (pid)
          await cloudinary.uploader
            .destroy(pid, { resource_type: "video" })
            .catch(() => {});
      }
      console.error("[BACKEND] DB SAVE FAILED:", err);
      throw err;
    } finally {
      // final cleanup of raw image uploads (original tmp files) - compressed files already removed
      await Promise.all(images.map((f) => fs.unlink(f.path).catch(() => {})));
      if (videoArr[0]) await fs.unlink(videoArr[0].path).catch(() => {});
    }
  }

  // ---------- UPDATE ----------
  async update(id, userId, data = {}, files = {}) {
    const t0 = process.hrtime();

    const newImages = files.images || [];
    const newVideoArr = files.video || [];

    // normalize oldImages from request (client sends URLs it wants to keep)
    let oldImagesFromClient = [];
    if (data.oldImages) {
      const parsed = safeParseJSONMaybe(data.oldImages);
      if (Array.isArray(parsed)) oldImagesFromClient = parsed;
      else oldImagesFromClient = [].concat(parsed);
    }

    // fetch existing
    const existing = await Property.findById(id);
    if (!existing) throw { status: 404, message: "Property not found" };
    if (String(existing.postedBy) !== String(userId))
      throw { status: 403, message: "Not authorized" };

    // convert some fields
    const cleaned = { ...data };
    if (cleaned.amenities) {
      cleaned.amenities = safeParseJSONMaybe(cleaned.amenities);
      if (!Array.isArray(cleaned.amenities)) cleaned.amenities = [];
    }
    const numericFields = [
      "latitude",
      "longitude",
      "price",
      "bhk",
      "areaSqFt",
      "bathrooms",
      "floor",
      "totalFloors",
    ];
    numericFields.forEach((f) => {
      if (cleaned[f] !== undefined && cleaned[f] !== "")
        cleaned[f] = Number(cleaned[f]);
      else delete cleaned[f];
    });

    // enforce image limits
    const keptCount = oldImagesFromClient.length || 0;
    if (keptCount + newImages.length > 8) {
      await Promise.all(
        newImages.map((f) => fs.unlink(f.path).catch(() => {}))
      );
      throw {
        status: 400,
        message: "Maximum 8 images allowed (existing + new)",
      };
    }
    if (newVideoArr[0] && newVideoArr[0].size > 12 * 1024 * 1024) {
      await Promise.all(
        newImages.map((f) => fs.unlink(f.path).catch(() => {}))
      );
      await fs.unlink(newVideoArr[0].path).catch(() => {});
      throw { status: 400, message: "Video file too large. Max 10-12MB raw." };
    }

    console.log("[BACKEND] START UPDATE:", hrTimeMs(t0));

    // 1) Upload new images (compress + upload in parallel)
    const uploadedNewImages = [];
    if (newImages.length > 0) {
      const tCompressStart = process.hrtime();
      const compressPromises = newImages.map((img) =>
        compressImage(img.path).then((compressedPath) => ({
          compressedPath,
          origPath: img.path,
        }))
      );
      const compressedResults = await Promise.all(compressPromises);
      console.log("[BACKEND] NEW_IMAGES_COMPRESSED:", hrTimeMs(tCompressStart));

      const tUploadStart = process.hrtime();
      try {
        const uplPromises = compressedResults.map(
          async ({ compressedPath }) => {
            const res = await cloudinary.uploader.upload(compressedPath, {
              folder: "worthit/properties/images",
              resource_type: "image",
            });
            uploadedNewImages.push({
              url: res.secure_url,
              public_id: res.public_id,
            });
            await fs.unlink(compressedPath).catch(() => {});
            return res;
          }
        );
        await Promise.all(uplPromises);
        console.log("[BACKEND] NEW_IMAGES_UPLOADED:", hrTimeMs(tUploadStart));
      } catch (err) {
        // cleanup compressed + newImages raw
        await Promise.all(
          compressedResults.map((r) =>
            fs.unlink(r.compressedPath).catch(() => {})
          )
        );
        console.error("[BACKEND] NEW IMAGE UPLOAD FAIL:", err);
        throw err;
      } finally {
        // remove raw temp files
        await Promise.all(
          newImages.map((f) => fs.unlink(f.path).catch(() => {}))
        );
      }
    }

    // 2) If video replaced, upload new video (compress -> upload) and delete old video from cloudinary
    let uploadedVideoUrl = null;
    if (newVideoArr[0]) {
      try {
        const tVidStart = process.hrtime();
        const compressedVideoPath = await compressVideo(newVideoArr[0].path);
        console.log("[BACKEND] NEW_VIDEO_COMPRESS:", hrTimeMs(tVidStart));
        const tVidUpload = process.hrtime();
        const vres = await cloudinary.uploader.upload(compressedVideoPath, {
          folder: "worthit/properties/videos",
          resource_type: "video",
        });
        uploadedVideoUrl = vres.secure_url;
        console.log("[BACKEND] NEW_VIDEO_UPLOAD:", hrTimeMs(tVidUpload));
        await fs.unlink(compressedVideoPath).catch(() => {});
        await fs.unlink(newVideoArr[0].path).catch(() => {});
      } catch (err) {
        // cleanup uploadedNewImages (if any)
        for (const up of uploadedNewImages) {
          if (up.public_id)
            await cloudinary.uploader
              .destroy(up.public_id, { resource_type: "image" })
              .catch(() => {});
        }
        console.error("[BACKEND] NEW VIDEO UPLOAD FAILED:", err);
        throw err;
      }
    }

    // 3) Delete removed images from Cloudinary (existing.images - oldImagesFromClient)
    const existingImageUrls = existing.images || [];
    const toDelete = existingImageUrls.filter(
      (u) => !oldImagesFromClient.includes(u)
    );
    if (toDelete.length) {
      for (const url of toDelete) {
        const pid = extractPublicIdFromUrl(url);
        if (pid) {
          await cloudinary.uploader
            .destroy(pid, { resource_type: "image" })
            .catch((e) => {
              console.warn("Failed deleting old image:", e.message || e);
            });
        }
      }
    }

    // 4) If uploaded new video, remove old video
    if (uploadedVideoUrl && existing.video) {
      const oldVidPid = extractPublicIdFromUrl(existing.video);
      if (oldVidPid) {
        await cloudinary.uploader
          .destroy(oldVidPid, { resource_type: "video" })
          .catch(() => {});
      }
    }

    // 5) Build final images array & update DB
    const finalImages = [
      ...(oldImagesFromClient || []),
      ...(uploadedNewImages.map((i) => i.url) || []),
    ];

    const updateObj = {
      ...cleaned,
      images: finalImages,
    };
    if (uploadedVideoUrl) updateObj.video = uploadedVideoUrl;

    // prevent accidental override
    delete updateObj.postedBy;
    delete updateObj.views;

    const tDbStart = process.hrtime();
    try {
      const updated = await Property.findOneAndUpdate(
        { _id: id, postedBy: userId },
        updateObj,
        { new: true }
      );
      if (!updated)
        throw { status: 403, message: "Not authorized to update property" };
      console.log("[BACKEND] DB_UPDATE:", hrTimeMs(tDbStart));
      console.log("[BACKEND] TOTAL_UPDATE_TIME:", hrTimeMs(t0));
      return updated;
    } catch (err) {
      // rollback: delete newly uploaded images/video if any
      for (const up of uploadedNewImages) {
        if (up.public_id)
          await cloudinary.uploader
            .destroy(up.public_id, { resource_type: "image" })
            .catch(() => {});
      }
      if (uploadedVideoUrl) {
        const pid = extractPublicIdFromUrl(uploadedVideoUrl);
        if (pid)
          await cloudinary.uploader
            .destroy(pid, { resource_type: "video" })
            .catch(() => {});
      }
      console.error("[BACKEND] UPDATE FAILED:", err);
      throw err;
    }
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

  async delete(id, userId) {
    // delete property and cloudinary assets
    const prop = await Property.findOneAndDelete({ _id: id, postedBy: userId });
    if (!prop)
      throw { status: 404, message: "Property not found or not authorized" };

    // attempt to delete images/videos from cloudinary (best-effort)
    try {
      for (const url of prop.images || []) {
        const pid = extractPublicIdFromUrl(url);
        if (pid)
          await cloudinary.uploader
            .destroy(pid, { resource_type: "image" })
            .catch(() => {});
      }
      if (prop.video) {
        const pid = extractPublicIdFromUrl(prop.video);
        if (pid)
          await cloudinary.uploader
            .destroy(pid, { resource_type: "video" })
            .catch(() => {});
      }
    } catch (e) {
      console.warn("Failed cleaning cloudinary on property delete", e);
    }
    return prop;
  }
}

export default new PropertyService();

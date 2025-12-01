// config/multer.config.js
import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    // single file size limit (general). We'll also enforce image/video separate limits in service.
    fileSize: 12 * 1024 * 1024, // 12 MB general per-file cap
  },
  fileFilter: (req, file, cb) => {
    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
    const allowedVideoTypes = [
      "video/mp4",
      "video/quicktime",
      "video/x-matroska",
    ];

    if (file.mimetype.startsWith("image/")) {
      if (!allowedImageTypes.includes(file.mimetype)) {
        return cb(new Error("Only JPEG, PNG or WEBP images are allowed"));
      }
      return cb(null, true);
    }

    if (file.mimetype.startsWith("video/")) {
      if (!allowedVideoTypes.includes(file.mimetype)) {
        return cb(new Error("Only MP4, MOV or MKV videos are allowed"));
      }
      return cb(null, true);
    }

    cb(new Error("Unsupported file type"));
  },
});

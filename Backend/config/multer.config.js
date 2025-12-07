// config/multer.config.js
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

// single file size (raw) limit — we'll check video size again in service
export const upload = multer({
  storage,
  limits: { fileSize: 80 * 1024 * 1024 }, // keep for safety; actual policy enforced in service
  fileFilter: (req, file, cb) => {
    // allow images & video only
    const allowedImage = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    const allowedVideo = ["video/mp4", "video/quicktime", "video/x-matroska"];
    if (file.fieldname === "images") {
      if (!allowedImage.includes(file.mimetype))
        return cb(new Error("Only PNG/JPG/WEBP images allowed"), false);
      return cb(null, true);
    }
    if (file.fieldname === "video") {
      if (!allowedVideo.includes(file.mimetype))
        return cb(new Error("Only MP4/MOV/MKV allowed"), false);
      return cb(null, true);
    }
    cb(null, false);
  },
});

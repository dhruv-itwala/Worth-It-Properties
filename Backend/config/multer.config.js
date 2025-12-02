import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 12 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
    const allowedVideoTypes = [
      "video/mp4",
      "video/quicktime",
      "video/x-matroska",
    ];
    if (file.mimetype.startsWith("image/")) {
      return allowedImageTypes.includes(file.mimetype)
        ? cb(null, true)
        : cb(new Error("Only JPEG/PNG/WEBP allowed"));
    }
    if (file.mimetype.startsWith("video/")) {
      return allowedVideoTypes.includes(file.mimetype)
        ? cb(null, true)
        : cb(new Error("Only MP4/MOV/MKV allowed"));
    }
    cb(new Error("Unsupported file type"));
  },
});

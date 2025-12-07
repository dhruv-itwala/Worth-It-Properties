// Backend/config/multer.profile.js
import multer from "multer";

export const uploadProfile = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

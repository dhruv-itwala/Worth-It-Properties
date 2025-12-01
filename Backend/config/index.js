// config/index.js
import corsOptions from "./cors.config.js";
import cloudinary from "./cloudinary.config.js";
import { connectDB } from "./db.config.js";
import { upload } from "./multer.config.js";
import jwtConfig from "./jwt.config.js";
import compressionConfig from "./compression.config.js";
import { getLocalIP } from "./ip.config.js";
import { SERVER_CONFIG } from "./server.config.js";

export {
  corsOptions,
  cloudinary,
  connectDB,
  upload,
  jwtConfig,
  compressionConfig,
  getLocalIP,
  SERVER_CONFIG,
};

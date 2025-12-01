// config/cors.config.js
import dotenv from "dotenv";
dotenv.config();

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
const allowAll = allowedOrigins.includes("*");

const corsOptions = {
  origin: function (origin, callback) {
    if (allowAll) {
      callback(null, true);
    } else if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

export default corsOptions;

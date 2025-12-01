// server.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import hpp from "hpp";

// ===== Load Config =====
import {
  corsOptions,
  cloudinary,
  connectDB,
  upload,
  jwtConfig,
  compressionConfig,
  getLocalIP,
  SERVER_CONFIG,
} from "./config/index.js";

import utilsRoutes from "./routes/Utils.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import propertyRoutes from "./routes/property.routes.js";
import searchRoutes from "./routes/search.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";

dotenv.config();
const app = express();

// ===== Useful Constants (for static path) =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== Trust Proxy (if behind reverse proxy / nginx / Heroku) =====
if (process.env.TRUST_PROXY === "true") {
  app.set("trust proxy", 1); // trust first proxy
}

// ===== Basic Middlewares =====
app.use(helmet()); // security headers
// If you need a custom CSP in production, configure below:
// app.use(helmet.contentSecurityPolicy({ directives: { ... } }));

app.use(morgan(process.env.LOG_LEVEL === "debug" ? "dev" : "combined"));

app.use(express.json({ limit: process.env.REQUEST_BODY_LIMIT || "20mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compressionConfig);

// ===== CORS (your config) =====
app.use(cors(corsOptions));

// ===== Prevent HTTP Param Pollution =====
app.use(hpp());

// ===== Rate limiting & slow down =====
const globalLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 1000, // 1 minute
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 120, // limit per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 8, // login attempts window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many auth attempts, please try again later.",
  },
});

// slow down repeated requests (optional but useful)
const speedLimiter = slowDown({
  windowMs: 60 * 1000,
  delayAfter: 30,
  delayMs: () => 500,
});

//enable the rate limiters in production
// app.use(globalLimiter);
// app.use(speedLimiter);

// ===== Static Folder =====
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===== DB Connection =====
connectDB();

// ===== API Base Version =====
const VERSION = process.env.API_VERSION || "v1";

// ===== API Test Route =====
app.get(`/api/${VERSION}`, (req, res) => {
  res.send("API Working");
});

// ===== Route registration (apply authLimiter to auth routes only) =====
app.use("/api", utilsRoutes);
// app.use(`/api/${VERSION}/auth`, authLimiter, authRoutes);
app.use(`/api/${VERSION}/auth`, authRoutes);
app.use(`/api/${VERSION}/users`, userRoutes);
app.use(`/api/${VERSION}/properties`, propertyRoutes);
app.use(`/api/${VERSION}/search`, searchRoutes);
app.use(`/api/${VERSION}/admin`, adminRoutes);
app.use(`/api/${VERSION}/wishlist`, wishlistRoutes);

// ===== 404 Handler =====
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ===== Error Handler (Base Structure) =====
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ===== Server Start =====
app.listen(SERVER_CONFIG.PORT, "0.0.0.0", () => {
  const { local, lan, ping } = SERVER_CONFIG.getURLs();
  console.log("=======================================");
  console.log(`🔥 Worth It Properties Backend Running`);
  console.log(`🔗 Local: ${local}`);
  console.log(`🌍 LAN:   ${lan}`);
  console.log(`🩺 Ping: ${ping}`);
  console.log("=======================================");
});

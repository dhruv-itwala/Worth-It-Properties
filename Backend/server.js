import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import hpp from "hpp";
import events from "events";

// avoid MaxListenersExceededWarning in dev
events.EventEmitter.defaultMaxListeners = 20;

import { corsOptions, connectDB, SERVER_CONFIG } from "./config/index.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import propertyRoutes from "./routes/property.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import { ping } from "./utils/ping.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.TRUST_PROXY === "true") app.set("trust proxy", 1);

app.use(helmet());
app.use(express.json({ limit: process.env.REQUEST_BODY_LIMIT || "20mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors(corsOptions));
app.use(hpp());

const globalLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 120,
  standardHeaders: true,
  legacyHeaders: false,
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
});
const speedLimiter = slowDown({
  windowMs: 60 * 1000,
  delayAfter: 30,
  delayMs: () => 500,
});

// apply global rate limiter and speed limiter
// app.use(globalLimiter);
// app.use(speedLimiter);

await connectDB?.();

// ping api
app.get("/api/ping", ping);

// API versioning
const VERSION = process.env.API_VERSION || "v1";

// health check
app.get(`/api/${VERSION}`, (req, res) => res.send("API Working"));

// app.use(`/api/${VERSION}/auth`, authLimiter, authRoutes);
// -------------------- AUTH ROUTES --------------------
app.use(`/api/${VERSION}/auth`, authRoutes);

// -------------------- USER ROUTES --------------------
app.use(`/api/${VERSION}/users`, userRoutes);

// -------------------- ADMIN ROUTES --------------------
app.use(`/api/${VERSION}/admin`, adminRoutes);

// -------------------- PROPERTY ROUTES --------------------
app.use(`/api/${VERSION}/properties`, propertyRoutes);

// -------------------- SEARCH ROUTES --------------------
import searchRoutes from "./routes/search.routes.js";
app.use(`/api/${VERSION}/search`, searchRoutes);

// -------------------- WISHLIST ROUTES --------------------
app.use(`/api/${VERSION}/wishlist`, wishlistRoutes);

// 404 handler
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Route not found" })
);

// error handler
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err);
  res
    .status(err.statusCode || 500)
    .json({ success: false, message: err.message || "Internal Server Error" });
});

// start server
app.listen(SERVER_CONFIG.PORT, "0.0.0.0", () => {
  const { local, lan, ping } = SERVER_CONFIG.getURLs();
  console.log("=======================================");
  console.log(`🔥 Worth It Properties Backend Running`);
  console.log(`🔗 Local: ${local}`);
  console.log(`🌍 LAN:   ${lan}`);
  console.log(`🩺 Ping: ${ping}`);
  console.log("=======================================");
});

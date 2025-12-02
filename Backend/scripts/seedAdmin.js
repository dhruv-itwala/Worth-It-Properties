import "dotenv/config";
import mongoose from "mongoose";
import Admin from "../models/Admin.model.js";
import { connectDB } from "../config/index.js";

const seed = async () => {
  await connectDB();
  const email = process.env.SEED_ADMIN_EMAIL || "admin@gmail.com";
  const password = process.env.SEED_ADMIN_PASSWORD || "Admin1234";
  const exists = await Admin.findOne({ email });
  if (exists) {
    console.log("Admin already exists:", email);
    process.exit(0);
  }
  const admin = await Admin.create({ email, password });
  console.log("Admin created:", admin.email);
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

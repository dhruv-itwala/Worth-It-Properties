import mongoose from "mongoose";
import { hashPassword, comparePassword } from "../utils/encryption.js";

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: { type: String, default: "admin" },
  },
  { timestamps: true }
);

// hash before save
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hashPassword(this.password);
  next();
});

adminSchema.methods.comparePassword = async function (plain) {
  return comparePassword(plain, this.password);
};

export default mongoose.models.Admin || mongoose.model("Admin", adminSchema);

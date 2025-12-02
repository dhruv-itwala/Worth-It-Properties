import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String, select: false },
    googleId: { type: String },
    profilePhoto: { type: String, default: "" },
    phone: { type: String, default: "" },
    whatsappNumber: { type: String, default: "" },

    gender: {
      type: String,
      enum: ["male", "female", "other", ""],
      default: "",
    },

    role: {
      type: String,
      enum: ["buyer", "owner", "builder", "broker", "admin"],
      default: "buyer",
    },

    state: { type: String, default: "" },
    city: { type: String, default: "" },
    area: { type: String, default: "" },

    preferredLocations: { type: [String], default: [] },

    companyName: { type: String, default: "" },
    companyWebsite: { type: String, default: "" },
    experienceYears: { type: String, default: "" },
    businessName: { type: String, default: "" },
    reraId: { type: String, default: "" },

    about: { type: String, default: "" },
    profileCompleted: { type: Boolean, default: false },
    lastLogin: { type: Date },

    listedProperties: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
    ],

    favouriteProperties: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);

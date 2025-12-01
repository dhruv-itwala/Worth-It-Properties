import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },

    phone: { type: String, default: "" },
    googleId: { type: String },
    profilePhoto: { type: String },

    role: {
      type: String,
      enum: ["buyer", "owner", "builder", "admin", "user"],
      default: "user",
    },

    city: { type: String, default: "" },
    area: { type: String, default: "" },

    profileCompleted: { type: Boolean, default: false },

    listedProperties: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
    ],

    favouriteProperties: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
    ],

    lastLogin: Date,
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

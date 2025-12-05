import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },

    price: { type: Number, required: true },
    bhk: { type: Number, required: true },

    propertyType: {
      type: String,
      enum: ["flat", "house", "plot", "office", "shop"],
      required: true,
    },

    areaSqFt: { type: Number, required: true },

    furnishing: {
      type: String,
      enum: ["unfurnished", "semi-furnished", "fully-furnished"],
      required: true,
    },

    status: {
      type: String,
      enum: ["new", "resale"],
      required: true,
    },

    city: { type: String, required: true },
    locality: { type: String, required: true },
    mapAddress: { type: String },

    latitude: { type: Number },
    longitude: { type: Number },

    // New premium-level fields
    bathrooms: { type: Number, default: 1 },
    parking: { type: Boolean, default: false },
    floor: { type: Number, default: 0 },
    totalFloors: { type: Number, default: 0 },
    ageOfProperty: { type: String, default: "" },
    facing: {
      type: String,
      enum: ["north", "south", "east", "west", ""],
      default: "",
    },
    amenities: { type: [String], default: [] },

    transactionType: {
      type: String,
      enum: ["sale", "rent"],
      default: "sale",
    },

    availability: { type: String, default: "" },

    published: { type: Boolean, default: true }, // admin can unpublish
    isVerified: { type: Boolean, default: false }, // manual verification
    views: { type: Number, default: 0 },

    images: [{ type: String }], // Cloudinary URLs
    video: { type: String }, // Cloudinary URL

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Full Text Search Index
propertySchema.index({
  title: "text",
  description: "text",
  locality: "text",
  city: "text",
});

// Single field indexes
propertySchema.index({ price: 1 });
propertySchema.index({ bhk: 1 });
propertySchema.index({ propertyType: 1 });
propertySchema.index({ furnishing: 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ city: 1 });
propertySchema.index({ postedBy: 1 });

export default mongoose.models.Property ||
  mongoose.model("Property", propertySchema);

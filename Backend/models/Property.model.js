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

    // change in Property.model.js
    images: [{ type: String }],
    video: { type: String },

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
propertySchema.index({ city: 1 });
propertySchema.index({ locality: 1 });
propertySchema.index({ propertyType: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ bhk: 1 });
propertySchema.index({ transactionType: 1 });
propertySchema.index({ postedBy: 1 }); // for user properties page

export default mongoose.models.Property ||
  mongoose.model("Property", propertySchema);

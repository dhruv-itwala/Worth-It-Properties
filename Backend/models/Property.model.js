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

    latitude: { type: Number },
    longitude: { type: Number },

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

propertySchema.index({
  city: "text",
  locality: "text",
  title: "text",
  description: "text",
});

propertySchema.index({ price: 1 });
propertySchema.index({ bhk: 1 });
propertySchema.index({ propertyType: 1 });
propertySchema.index({ furnishing: 1 });
propertySchema.index({ status: 1 });

const Property =
  mongoose.models.Property || mongoose.model("Property", propertySchema);

export default Property;

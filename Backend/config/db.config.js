import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const user = process.env.MONGO_USER;
    const pass = process.env.MONGO_PASS;
    const cluster = process.env.MONGO_CLUSTER;
    const dbName = process.env.MONGO_DB || "";

    const URI = `mongodb+srv://${user}:${pass}@${cluster}/${dbName}`;

    await mongoose.connect(URI);

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

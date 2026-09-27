import mongoose from "mongoose";
import envConfig from "./env.config.js";

export async function connectDB() {
  try {
    await mongoose.connect(envConfig.DATABASE_URL);
    console.log("DB connected successfully");
  } catch (err) {
    console.log("error connecting DB", err);
  }
}

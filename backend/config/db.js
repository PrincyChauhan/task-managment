import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const ConnectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
    });
    console.log("MongoDB connected successfully:", process.env.MONGO_URL);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};

export { ConnectDB };

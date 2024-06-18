import mongoose from "mongoose";

let isConnected = false;

async function connectToDb() {
  if (isConnected) {
    console.log("Already connected to MongoDB");
    return;
  }

  try {
    const url = process.env.MONGO_URL;
    if (!url) {
      throw new Error("MONGO_URL is not defined in environment variables");
    }

    await mongoose.connect(url);

    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

export default connectToDb;

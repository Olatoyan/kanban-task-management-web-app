import mongoose from "mongoose";

let isConnected = false;

async function connectToDb() {
  if (isConnected) return;

  try {
    const url = process.env.MONGO_URL!;
    await mongoose.connect(url);
    console.log("Connected to MongoDB");
    isConnected = true;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

export default connectToDb;

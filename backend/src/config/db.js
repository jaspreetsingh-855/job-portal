import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let memoryServer = null;

export async function connectDB() {
  if (process.env.MONGO_URI) {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB (MONGO_URI)");
    return;
  }

  memoryServer = await MongoMemoryServer.create();
  await mongoose.connect(memoryServer.getUri());
  console.log(
    "Connected to in-memory MongoDB (set MONGO_URI in .env for Atlas/local MongoDB)"
  );
}

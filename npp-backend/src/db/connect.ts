//npp-backend\src\db\connect.ts

import mongoose from "mongoose";

export async function connectDB(uri: string) {
  if (!uri) throw new Error("connectDB: Missing Mongo URI");
  mongoose.set("strictQuery", true);

  await mongoose.connect(uri, {
    // keep defaults lean; mongoose v7+ handles most options
  });

  console.log("✅ MongoDB connected");
  return mongoose.connection;
}




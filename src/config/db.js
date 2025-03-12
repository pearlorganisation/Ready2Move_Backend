import mongoose from "mongoose";
import { DB_NAME } from "../../constants.js";

export const connectToMongoDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
      { retryWrites: true, w: "majority", appName: "Cluster0" }
    );
    console.log(
      `MongoDB connected. DB Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error(`MongoDB Connection Failed ${error}`);
    process.exit(1);
  }
};

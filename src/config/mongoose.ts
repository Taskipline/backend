import { connect, set } from "mongoose";
import { validateEnv } from "./env.config";

const { MONGO_DB_URI } = validateEnv();

// connection to db
export const connectToDB = async () => {
  try {
    set("strictQuery", false);
    const db = await connect(MONGO_DB_URI);
    console.log("MongoDB connected to", db.connection.name);
    return true;
    // Emit an event when the connection is successful
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    // Don't throw the error, just log it and return false
    return false;
  }
};

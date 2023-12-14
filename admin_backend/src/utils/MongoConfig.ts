import mongoose from "mongoose";
import { env } from "./validateEnv";

export const ConnectMongoDb = async () => {
  try {
    await mongoose.connect(env.DB_URL).then(() => {
      console.log("DB Connection established");
    });
  } catch (error) {
    console.log(error);
  }
};

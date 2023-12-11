require("dotenv").config();
import "express-async-errors";

import express from "express";
const app = express();

import { env } from "./utils/validateEnv";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import fileUpload from "express-fileupload";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.use(cors({ origin: env.FRONTEND_ORIGIN_URL }));
app.use(morgan("dev"));
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));
app.use(express.json());

app.use("/api/v1/user", require("./routes/user.routes"));
app.use("/api/v1/auth", require("./routes/auth.routes"));
app.use("/api/v1/url", require("./routes/shortner.routes"));
app.use("/api/v1/dashboard", require("./routes/dashboard.routes"));

app.use(require("./middleware/not-found"));
app.use(require("./middleware/error-handler"));

const serverInit = async () => {
  try {
    await mongoose.connect(env.DB_URL).then(() => {
      console.log("DB Connection established");
    });
    app.listen(env.PORT, () => {
      console.log("server listening on " + env.PORT);
    });
  } catch (error) {
    console.log(error, "Server intialization failed");
  }
};

serverInit();

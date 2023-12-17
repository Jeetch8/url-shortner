require("dotenv").config();
require("express-async-errors");

import express, { Express, Router } from "express";
import cors from "cors";
import { env } from "./utils/validateEnv";
import morgan from "morgan";
import fileUpload from "express-fileupload";
import monitor from "express-status-monitor";
import { ConnectMongoDb } from "./utils/MongoConfig";
import { v2 as cloudinary } from "cloudinary";
import { Routes } from "./types/routes.types";
import { errorHandler, notFound } from "./middleware/error-handler";
import passport from "passport";
import { logger, stream } from "@/utils/Logger";

export class Appication {
  private _server = express();
  private statsMonitor = monitor({ path: "" });

  constructor(routes: { path: string; router: Routes }[]) {
    this.connetToDatabase();
    this.intializeMiddlewares();
    this.intializeRoute(routes);
    this.intializeErrorHandlers();
  }

  private intializeMiddlewares() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    this._server.use(morgan("dev", { stream }));
    this._server.use(cors({ origin: env.FRONTEND_ORIGIN_URL }));
    this._server.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));
    this._server.use(express.json());
  }

  private intializeRoute(routes: { path: string; router: Routes }[]) {
    this._server.use(passport.initialize());
    routes.forEach((route) => {
      this._server.use("/api/v1/" + route.path, route.router.router);
    });
    this._server.use("/api/v1/sever_stats", this.statsMonitor);
  }

  public getServer() {
    return this._server;
  }

  private async connetToDatabase() {
    await ConnectMongoDb();
  }

  private intializeErrorHandlers() {
    this._server.use(errorHandler);
    this._server.use(notFound);
  }

  public async startServer() {
    this._server.listen(env.PORT, () => {
      logger.info(`=================================`);
      logger.info(`🚀 App listening on the port ${env.PORT}`);
      logger.info(`=================================`);
    });
  }
}

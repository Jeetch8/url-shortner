import { Router } from "express";
import { UserController } from "@/controllers/user.controller";
import { authenticateUser } from "@/middleware/full-auth";
import { upload } from "@/utils/MulterConfig";
import { Routes } from "@/types/routes.types";

export class UserRouter implements Routes {
  public router = Router();
  public Controller = new UserController();
  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes() {
    this.router.get("/me", authenticateUser, this.Controller.getMyProfile);
    this.router.put(
      "/",
      authenticateUser,
      upload.single("image"),
      this.Controller.updateUserProfile
    );
    this.router.get(
      "/",
      authenticateUser,
      this.Controller.getAllUserGeneratedLinks
    );
    this.router.get(
      "/stats",
      authenticateUser,
      this.Controller.getUserOverallStats
    );
    this.router.patch(
      "/change-password",
      authenticateUser,
      this.Controller.updatePassword
    );
    this.router.patch(
      "/favorite",
      authenticateUser,
      this.Controller.toogleFavoriteUrls
    );
    this.router.get(
      "/bootup",
      authenticateUser,
      this.Controller.getUserBootUpData
    );
  }
}

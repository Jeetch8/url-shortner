import { Router } from "express";

import { ShortnerController } from "@/controllers/shortner.controller";
import { authenticateUser } from "../middleware/full-auth";
import { Routes } from "@/types/routes.types";

export class ShortnerRouter implements Routes {
  public router = Router();
  public Controller = new ShortnerController();
  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes() {
    this.router.get(
      "/",
      authenticateUser,
      this.Controller.getAllUserGeneratedLinks
    );
    this.router.get("/:id", authenticateUser, this.Controller.getShortendUrl);
    this.router.post(
      "/createLink",
      authenticateUser,
      this.Controller.create_shortned_url
    );
    this.router.put("/:id", authenticateUser, this.Controller.editShortnerUrl);
    this.router.delete(
      "/:id",
      authenticateUser,
      this.Controller.deleteShortendUrl
    );
  }
}

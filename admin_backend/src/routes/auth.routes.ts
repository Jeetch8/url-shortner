import { Router } from "express";
import { AuthController } from "@/controllers/auth.controller";
import { Routes } from "@/types/routes.types";

export class AuthRouter implements Routes {
  public router = Router();
  public Controller = new AuthController();
  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes() {
    this.router.post("/register", this.Controller.register);
    this.router.post("/login", this.Controller.login);
    this.router.get("/logout", this.Controller.logout);
  }
}

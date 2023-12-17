import { Router } from "express";
import { AuthController } from "@/controllers/auth.controller";
import { Routes } from "@/types/routes.types";
import passport from "../config/Passport";

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
    this.router.get(
      "/google",
      passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false,
      })
    );
    this.router.get(
      "/google/callback",
      passport.authenticate("google", {
        failureRedirect: "/login",
        session: false,
      }),
      this.Controller.googleAuthCallback
    );
    this.router.get(
      "/github",
      passport.authenticate("github", { scope: ["user:email"], session: false })
    );
    this.router.get(
      "/github/callback",
      passport.authenticate("github", {
        failureRedirect: "/login",
        session: false,
      }),
      this.Controller.githubAuthCallback
    );
  }
}

import express, { Router } from "express";
import { authenticateUser } from "@/middleware/full-auth";
import { DashboardController } from "../controllers/dashboard.controller";
import { Routes } from "@/types/routes.types";

export class DashboardRouter implements Routes {
  public router = Router();
  public Controller = new DashboardController();
  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes() {
    this.router.post(
      "/link/:id",
      authenticateUser,
      this.Controller.getShortendLinkStats
    );
  }
}

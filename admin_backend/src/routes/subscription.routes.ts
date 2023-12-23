import { Router } from "express";
import { authenticateUser } from "../middleware/full-auth";
import { Routes } from "@/types/routes.types";
import { SubscriptionController } from "@/controllers/subscription.controller";

export class SubscriptionRouter implements Routes {
  public router = Router();
  public Controller = new SubscriptionController();
  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes() {
    this.router.post(
      "/create-checkout-session",
      authenticateUser,
      this.Controller.createCheckoutSession
    );
    this.router.post(
      "/create-subscription",
      authenticateUser,
      this.Controller.createSubscription
    );
  }
}

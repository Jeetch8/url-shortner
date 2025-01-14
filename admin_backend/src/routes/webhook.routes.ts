import { Router } from "express";
import { Routes } from "@/types/routes.types";
import { WebhookController } from "@/controllers/webhook.controller";
import bodyParser from "body-parser";

export class WebhookRouter implements Routes {
  public router = Router();
  public Controller = new WebhookController();
  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes() {
    this.router.post(
      "/stripe",
      bodyParser.raw({ type: "application/json" }),
      //   authenticateUser,
      this.Controller.handleStripeWebhookEvent
    );
  }
}

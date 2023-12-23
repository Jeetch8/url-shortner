// src/config/stripe.ts
import { env } from "@/utils/validateEnv";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  timeout: 120000,
  apiVersion: "2024-04-10", // Use the latest API version,
});

export default stripe;

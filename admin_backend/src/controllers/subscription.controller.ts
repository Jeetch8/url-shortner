import { Request, Response } from "express";
import stripe from "@/config/stripe";
import { UserModel } from "@/models/user.model";
import {
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from "@shared/utils/CustomErrors";
import { env } from "@/utils/validateEnv";
import { UserDocument } from "@shared/types/mongoose-types";
import { APIResponseObj } from "@shared/types/controllers";
import { getProductWithPriceId } from "@/utils/subscription_plans/helpers";
import Container from "typedi";
import { SubscriptionService } from "@/services/subscription.service";
import { SubscriptionModel } from "@/models/subscription.model";

export class SubscriptionController {
  async createSubscription(
    req: Request,
    res: Response<
      APIResponseObj<{ subscriptionId: string; clientSecret: string }>
    >
  ) {
    const { priceId } = req.body;
    const userId = req?.user?.userId;
    const user: UserDocument | null = await UserModel.findById(userId);
    if (!user) throw new UnauthorizedError("User is not authenticated");
    const customer = await stripe.customers.retrieve(user?.customerStripeId);
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });
    return res.status(200).json({
      status: "success",
      data: {
        subscriptionId: subscription.id,
        clientSecret: (subscription.latest_invoice as any).payment_intent
          .client_secret,
      },
    });
  }

  async createCheckoutSession(req: Request, res: Response) {
    const userId = req.user.userId;
    const priceId: string = req.body.priceId;
    const user: UserDocument | null = await UserModel.findById(userId);
    const maxRetries = 3;
    let retries = 0;
    const product = getProductWithPriceId(priceId);
    while (retries < maxRetries) {
      try {
        const session = await stripe.checkout.sessions.create({
          mode: "subscription",
          metadata: {
            price_id: priceId,
            product_id: product?.product_id,
            product_name_db: product.db_product_title,
            product_name: product.product_name,
          },
          customer: user?.customerStripeId,
          line_items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          success_url: env.FRONTEND_ORIGIN_URL + "/billing-and-usuage",
        });

        if (!session.url) throw new InternalServerError("Something went wrong");
        return res.status(200).json({ data: { url: session.url } });
      } catch (error) {
        retries++;
        if (retries === maxRetries) {
          console.error("Max retries reached. Error:", error);
          throw new InternalServerError(
            "Failed to create checkout session after multiple attempts"
          );
        }
        console.log(`Retry attempt ${retries}/${maxRetries}`);
        await new Promise((resolve) => setTimeout(resolve, 1000 * retries)); // Exponential backoff
      }
    }
  }

  public async getSubscriptionUsuage(req: Request, res: Response) {
    const userId = req.user.userId;
    const subscription = await SubscriptionModel.findOne({ user_id: userId });
  }

  private async endSubscription(req: Request, res: Response) {
    const userId = req.user.userId;
    const subscriptionService = Container.get(SubscriptionService);
    const userSubscription = await subscriptionService.getUserSubscription({
      userId,
    });
    if (!userSubscription)
      throw new BadRequestError("User Subsction not found");
    const endSubscription = await subscriptionService.endSubscription(
      userSubscription?._id.toString()
    );
  }
}

import { env } from "@/utils/validateEnv";
import { BadRequestError } from "@shared/utils/CustomErrors";
import { Request, Response } from "express";
import stripe from "src/config/stripe";
import { SubscriptionModel } from "@/models/subscription.model";
import { Container } from "typedi";
import { SubscriptionService } from "@/services/subscription.service";
import Stripe from "stripe";
import { getProductWithPriceId } from "@/utils/subscription_plans/helpers";
import dayjs from "dayjs";
import { UserModel } from "@/models";
import { UserPayment_method } from "@shared/types/mongoose-types";

// invoice.paid
// invoice.payment_failed
// invoice.upcoming
// customer.subscription.deleted
// customer.subscription.succedded
// customer.subscription.trial_will_end
// customer.subscription.resumed

export class WebhookController {
  constructor() {
    this.handleStripeWebhookEvent = this.handleStripeWebhookEvent.bind(this);
    this.handleCustomerSubscriptionUpdate =
      this.handleCustomerSubscriptionUpdate.bind(this);
  }

  async handleStripeWebhookEvent(req: Request, res: Response) {
    const sig = req.headers["stripe-signature"] as string;
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    switch (event.type) {
      case "customer.subscription.updated":
        await this.handleCustomerSubscriptionUpdate(event);
        break;
      case "customer.subscription.deleted":
        await this.handleUserSubscriptionDeleted(event);
        break;
      case "payment_method.attached":
        await this.handlePaymentMethodAttached(event);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }

  private async handleUserSubscriptionDeleted(
    event: Stripe.CustomerSubscriptionDeletedEvent
  ) {
    const subscriptionService = Container.get(SubscriptionService);
    const eventObj = event.data.object;
    if (!eventObj.customer) throw new BadRequestError("Event was not defined");
    await subscriptionService.updateSubscription({
      customerStripeId: eventObj.customer.toString(),
      props: {
        status: "PLAN ENDED",
      },
    });
  }

  private async handleCustomerSubscriptionUpdate(
    event: Stripe.CustomerSubscriptionUpdatedEvent
  ) {
    const eventObject = event.data.object;
    const subsriptionService = Container.get(SubscriptionService);
    const userCurrentSubscription =
      await subsriptionService.getUserSubscription({
        customerStripeId: eventObject.customer.toString(),
      });
    if (userCurrentSubscription?.plan_name === "trial") {
      await stripe.subscriptions.cancel(
        userCurrentSubscription.stripe_subscription_id
      );
    }
    const priceId = eventObject.items.data[0].price.id;
    const product = getProductWithPriceId(priceId);
    let interval_decimal: "month" | "year" = "month";
    if (product.plan_name === "annual") interval_decimal = "year";
    const valid_till = dayjs(new Date()).add(1, interval_decimal).toString();
    await SubscriptionModel.findByIdAndUpdate(userCurrentSubscription?._id, {
      plan_name: product.plan_name,
      status: "OK",
      price_id: priceId,
      product_name: product.product_name,
      price: product.plans[product.plan_name].price,
      interval_value: 1,
      interval_decimal,
      valid_till,
      product_id: product.product_id,
      currency: "dollar",
      $push: {
        purchase_log: {
          date_of_purchase: dayjs(new Date()).toString(),
          product_id: product.product_id,
          product_name: product.product_name,
          price_id: priceId,
          amount: product.plans[product.plan_name].price,
          payment_method_brand: eventObject.payment_settings?.payment_method_types,
          card_last4: "4242",
        },
      },
    });
  }

  private async handlePaymentMethodAttached(
    event: Stripe.PaymentMethodAttachedEvent
  ) {
    const eventObject = event.data.object;
    const cardDetails = eventObject.card;
    if (!cardDetails?.funding) throw new BadRequestError("Card type not found");
    const card = {
      pm_type: cardDetails?.funding,
      expiry_month: cardDetails.exp_month,
      expiry_year: cardDetails.exp_year,
      last_4_card_digits: cardDetails.last4,
      brand: cardDetails.brand,
    };
    const updatedUser = await UserModel.findOneAndUpdate(
      { customerStripeId: eventObject.customer },
      {
        $push: { payment_method: card },
      }
    );
    if (!updatedUser) throw new BadRequestError("User card update failed");
  }
}

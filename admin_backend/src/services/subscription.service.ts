import { SubscriptionModel } from '@/models/subscription.model';
import { Subscription } from '@/types/mongoose-types';
import { Service } from 'typedi';
import dayjs from 'dayjs';
import stripe from '@/config/stripe';

@Service()
export class SubscriptionService {
  public async createSubscription(
    props: Omit<Subscription, 'user_id' | 'valid_till' | '_id'> & {
      user_id: string;
    }
  ) {
    const expirationDate = dayjs(new Date())
      .add(props.interval_value, props.interval_decimal)
      .toString();
    return await SubscriptionModel.create({
      ...props,
      valid_till: expirationDate,
    });
  }

  public async getUserSubscription({
    subscriptionId,
    userId,
    customerStripeId,
  }: {
    subscriptionId?: string;
    userId?: string;
    customerStripeId?: string;
  }): Promise<Subscription | undefined | null> {
    if (subscriptionId) {
      return await SubscriptionModel.findById(subscriptionId);
    } else {
      const queryVar = userId
        ? { user_id: userId }
        : { customer_stripe_id: customerStripeId };
      return SubscriptionModel.findOne(queryVar);
    }
  }

  public async updateSubscription({
    props,
    subscriptionId,
    userId,
    customerStripeId,
  }: {
    props: Partial<Subscription>;
    subscriptionId?: string;
    userId?: string;
    customerStripeId?: string;
  }) {
    if (subscriptionId) {
      return await SubscriptionModel.findByIdAndUpdate(subscriptionId, {
        ...props,
      });
    } else {
      const queryVar = userId
        ? { user_id: userId }
        : { customer_stripe_id: customerStripeId };
      return await SubscriptionModel.findOneAndUpdate(queryVar, { ...props });
    }
  }

  public async deleteSubscription({
    subscriptionId,
    userId,
    customerStripeId,
  }: {
    subscriptionId?: string;
    userId?: string;
    customerStripeId?: string;
  }): Promise<Subscription | undefined | null> {
    if (subscriptionId) {
      return await SubscriptionModel.findByIdAndDelete(subscriptionId);
    } else {
      const queryVar = userId
        ? { user_id: userId }
        : { customer_stripe_id: customerStripeId };
      return SubscriptionModel.findOneAndDelete(queryVar);
    }
  }

  public async endSubscription(subscription_id: string) {
    return await stripe.subscriptions.cancel(subscription_id);
  }
}

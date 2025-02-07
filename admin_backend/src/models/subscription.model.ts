import {
  SubscriptionDocument,
  SubscriptionModel as ISubModel,
  SubscriptionSchema,
} from '@/types/mongoose-types';
import mongoose from 'mongoose';

const PurchaseSchema = new mongoose.Schema({
  date_of_purchase: {
    type: String,
    required: true,
  },
  expired_on: {
    type: String,
    required: true,
  },
  product_id: {
    type: String,
    required: true,
  },
  product_name: {
    type: String,
    required: true,
  },
  price_id: { type: String, required: true },
  amount: { type: Number, required: true },
  payment_method_brand: { type: String, required: true },
  card_last4: { type: String, required: true },
});

const SubscriptionSchema: SubscriptionSchema = new mongoose.Schema(
  {
    customer_stripe_id: {
      type: String,
      required: true,
      unique: true,
    },
    stripe_subscription_id: {
      type: String,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    product_name: {
      type: String,
      required: true,
      enum: ['trial', 'personal', 'team', 'enterprise'],
    },
    usuage: {
      link_generated: {
        type: Number,
        required: true,
        default: 0,
      },
      custom_domains: {
        type: Number,
        required: true,
        default: 0,
      },
      landing_pages: {
        type: Number,
        required: true,
        default: 0,
      },
      workspaces: {
        type: Number,
        required: true,
        default: 0,
      },
      teams: {
        type: Number,
        required: true,
        default: 0,
      },
      last_interval_date: {
        type: String,
        required: true,
      },
    },
    product_id: {
      type: String,
      required: true,
    },
    plan_name: {
      type: String,
      enum: ['trial', 'monthly', 'annual'],
      required: true,
    },
    price_id: {
      type: String,
      required: true,
    },
    price: { type: Number, required: true },
    currency: {
      type: String,
      enum: ['ruppee', 'dollar'],
      required: true,
    },
    interval_value: {
      type: Number,
      required: true,
    },
    interval_decimal: {
      type: String,
      enum: ['day', 'month', 'year'],
      required: true,
    },
    status: {
      type: String,
      enum: ['OK', 'PAYMENT METHOD ERROR', 'PLAN ENDED'],
      required: true,
    },
    error: {
      type: String,
    },
    purchase_log: [PurchaseSchema],
    valid_till: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export const SubscriptionModel = mongoose.model<
  SubscriptionDocument,
  ISubModel
>('Subscription', SubscriptionSchema);

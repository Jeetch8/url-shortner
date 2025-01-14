import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import {
  UserDocument,
  UserModel as IUserModel,
  UserSchema,
} from "@shared/types/mongoose-types";

const PaymentMethodSchema = new mongoose.Schema({
  pm_type: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  last_4_card_digits: {
    type: String,
    required: true,
  },
  expiry_month: {
    type: Number,
    required: true,
  },
  expiry_year: {
    type: Number,
    required: true,
  },
});

const addressSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
  },
  line1: { type: String, required: true },
  line2: { type: String, default: null, required: true },
  postal_code: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
});

const userSchema: UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 3,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profile_img: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      default: "null",
      min: 6,
      select: false,
    },
    subscription_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },
    payment_method: [PaymentMethodSchema],
    generated_links: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShortendUrl",
      },
    ],
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShortendUrl",
      },
    ],
    address: addressSchema,
    billing_address: addressSchema,
    googleOAuthId: { type: String, default: "null", required: true },
    githubOAuthId: { type: String, dwfault: "null", required: true },
    customerStripeId: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  if (this.password === "null") return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  if (this.password === "null") return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = mongoose.model<UserDocument, IUserModel>(
  "User",
  userSchema
);

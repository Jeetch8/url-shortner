/* tslint:disable */
/* eslint-disable */

// ######################################## THIS FILE WAS GENERATED BY MONGOOSE-TSGEN ######################################## //

// NOTE: ANY CHANGES MADE WILL BE OVERWRITTEN ON SUBSEQUENT EXECUTIONS OF MONGOOSE-TSGEN.

import mongoose from "mongoose";

/**
 * Lean version of ShortendUrlDocument
 *
 * This has all Mongoose getters & functions removed. This type will be returned from `ShortendUrlDocument.toObject()`. To avoid conflicts with model names, use the type alias `ShortendUrlObject`.
 * ```
 * const shortendurlObject = shortendurl.toObject();
 * ```
 */
export type ShortendUrl = {
  link_title: string;
  link_enabled: boolean;
  link_description?: string;
  original_url: string;
  shortend_url_cuid: string;
  creator_id: User["_id"] | User;
  link_cloaking: boolean;
  sharing_preview: {
    title?: string;
    description?: string;
    image?: string;
  };
  tags: string[];
  protected: {
    enabled: boolean;
    password?: string;
  };
  link_expiry: {
    enabled: boolean;
    link_expires_on?: string;
    expiry_redirect_url?: string;
  };
  link_targetting: {
    enabled: boolean;
    target?: string;
    countries?: any;
    device: {
      ios?: string;
      android?: string;
      windows?: string;
      linux?: string;
      mac?: string;
    };
    rotate: string[];
  };
  stats?: Stat["_id"] | Stat;
  _id: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * Lean version of ShortendUrlDocument (type alias of `ShortendUrl`)
 *
 * Use this type alias to avoid conflicts with model names:
 * ```
 * import { ShortendUrl } from "../models"
 * import { ShortendUrlObject } from "../interfaces/mongoose.gen.ts"
 *
 * const shortendurlObject: ShortendUrlObject = shortendurl.toObject();
 * ```
 */
export type ShortendUrlObject = ShortendUrl;

/**
 * Mongoose Query type
 *
 * This type is returned from query functions. For most use cases, you should not need to use this type explicitly.
 */
export type ShortendUrlQuery = mongoose.Query<
  any,
  ShortendUrlDocument,
  ShortendUrlQueries
> &
  ShortendUrlQueries;

/**
 * Mongoose Query helper types
 *
 * This type represents `ShortendUrlSchema.query`. For most use cases, you should not need to use this type explicitly.
 */
export type ShortendUrlQueries = {};

export type ShortendUrlMethods = {
  comparePassword: (this: ShortendUrlDocument, ...args: any[]) => any;
};

export type ShortendUrlStatics = {};

/**
 * Mongoose Model type
 *
 * Pass this type to the Mongoose Model constructor:
 * ```
 * const ShortendUrl = mongoose.model<ShortendUrlDocument, ShortendUrlModel>("ShortendUrl", ShortendUrlSchema);
 * ```
 */
export type ShortendUrlModel = mongoose.Model<
  ShortendUrlDocument,
  ShortendUrlQueries
> &
  ShortendUrlStatics;

/**
 * Mongoose Schema type
 *
 * Assign this type to new ShortendUrl schema instances:
 * ```
 * const ShortendUrlSchema: ShortendUrlSchema = new mongoose.Schema({ ... })
 * ```
 */
export type ShortendUrlSchema = mongoose.Schema<
  ShortendUrlDocument,
  ShortendUrlModel,
  ShortendUrlMethods,
  ShortendUrlQueries
>;

/**
 * Mongoose Document type
 *
 * Pass this type to the Mongoose Model constructor:
 * ```
 * const ShortendUrl = mongoose.model<ShortendUrlDocument, ShortendUrlModel>("ShortendUrl", ShortendUrlSchema);
 * ```
 */
export type ShortendUrlDocument = mongoose.Document<
  mongoose.Types.ObjectId,
  ShortendUrlQueries
> &
  ShortendUrlMethods & {
    link_title: string;
    link_enabled: boolean;
    link_description?: string;
    original_url: string;
    shortend_url_cuid: string;
    creator_id: UserDocument["_id"] | UserDocument;
    link_cloaking: boolean;
    sharing_preview: {
      title?: string;
      description?: string;
      image?: string;
    };
    tags: mongoose.Types.Array<string>;
    protected: {
      enabled: boolean;
      password?: string;
    };
    link_expiry: {
      enabled: boolean;
      link_expires_on?: string;
      expiry_redirect_url?: string;
    };
    link_targetting: {
      enabled: boolean;
      target?: string;
      countries?: any;
      device: {
        ios?: string;
        android?: string;
        windows?: string;
        linux?: string;
        mac?: string;
      };
      rotate: mongoose.Types.Array<string>;
    };
    stats?: StatDocument["_id"] | StatDocument;
    _id: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
  };

/**
 * Lean version of StatClicker_infoDocument
 *
 * This has all Mongoose getters & functions removed. This type will be returned from `StatDocument.toObject()`.
 * ```
 * const statObject = stat.toObject();
 * ```
 */
export type StatClicker_info = {
  ip_address: string;
  platform: string;
  device: string;
  referrer: string;
  browser: string;
  location: {
    country: string;
    city: string;
  };
  _id: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * Lean version of StatDocument
 *
 * This has all Mongoose getters & functions removed. This type will be returned from `StatDocument.toObject()`. To avoid conflicts with model names, use the type alias `StatObject`.
 * ```
 * const statObject = stat.toObject();
 * ```
 */
export type Stat = {
  shortend_url_id: ShortendUrl["_id"] | ShortendUrl;
  total_clicks: number;
  clicker_info: StatClicker_info[];
  _id: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * Lean version of StatDocument (type alias of `Stat`)
 *
 * Use this type alias to avoid conflicts with model names:
 * ```
 * import { Stat } from "../models"
 * import { StatObject } from "../interfaces/mongoose.gen.ts"
 *
 * const statObject: StatObject = stat.toObject();
 * ```
 */
export type StatObject = Stat;

/**
 * Mongoose Query type
 *
 * This type is returned from query functions. For most use cases, you should not need to use this type explicitly.
 */
export type StatQuery = mongoose.Query<any, StatDocument, StatQueries> &
  StatQueries;

/**
 * Mongoose Query helper types
 *
 * This type represents `StatSchema.query`. For most use cases, you should not need to use this type explicitly.
 */
export type StatQueries = {};

export type StatMethods = {};

export type StatStatics = {};

/**
 * Mongoose Model type
 *
 * Pass this type to the Mongoose Model constructor:
 * ```
 * const Stat = mongoose.model<StatDocument, StatModel>("Stat", StatSchema);
 * ```
 */
export type StatModel = mongoose.Model<StatDocument, StatQueries> & StatStatics;

/**
 * Mongoose Schema type
 *
 * Assign this type to new Stat schema instances:
 * ```
 * const StatSchema: StatSchema = new mongoose.Schema({ ... })
 * ```
 */
export type StatSchema = mongoose.Schema<
  StatDocument,
  StatModel,
  StatMethods,
  StatQueries
>;

/**
 * Mongoose Subdocument type
 *
 * Type of `StatDocument["clicker_info"]` element.
 */
export type StatClicker_infoDocument = mongoose.Types.Subdocument & {
  ip_address: string;
  platform: string;
  device: string;
  referrer: string;
  browser: string;
  location: {
    country: string;
    city: string;
  };
  _id: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * Mongoose Document type
 *
 * Pass this type to the Mongoose Model constructor:
 * ```
 * const Stat = mongoose.model<StatDocument, StatModel>("Stat", StatSchema);
 * ```
 */
export type StatDocument = mongoose.Document<
  mongoose.Types.ObjectId,
  StatQueries
> &
  StatMethods & {
    shortend_url_id: ShortendUrlDocument["_id"] | ShortendUrlDocument;
    total_clicks: number;
    clicker_info: mongoose.Types.DocumentArray<StatClicker_infoDocument>;
    _id: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
  };

/**
 * Lean version of SubscriptionPurchase_logDocument
 *
 * This has all Mongoose getters & functions removed. This type will be returned from `SubscriptionDocument.toObject()`.
 * ```
 * const subscriptionObject = subscription.toObject();
 * ```
 */
export type SubscriptionPurchase_log = {
  date_of_purchase: string;
  expired_on: string;
  product_id: string;
  product_name: string;
  price_id: string;
  amount: number;
  payment_method_brand: string;
  card_last4: string;
  _id: mongoose.Types.ObjectId;
};

/**
 * Lean version of SubscriptionDocument
 *
 * This has all Mongoose getters & functions removed. This type will be returned from `SubscriptionDocument.toObject()`. To avoid conflicts with model names, use the type alias `SubscriptionObject`.
 * ```
 * const subscriptionObject = subscription.toObject();
 * ```
 */
export type Subscription = {
  customer_stripe_id: string;
  stripe_subscription_id: string;
  user_id: User["_id"] | User;
  product_name: "trial" | "personal" | "team" | "enterprise";
  usuage: {
    link_generated: number;
    custom_domains: number;
    landing_pages: number;
    workspaces: number;
    teams: number;
    last_interval_date: string;
  };
  product_id: string;
  plan_name: "trial" | "monthly" | "annual";
  price_id: string;
  price: number;
  currency: "ruppee" | "dollar";
  interval_value: number;
  interval_decimal: "day" | "month" | "year";
  status: "OK" | "PAYMENT METHOD ERROR" | "PLAN ENDED";
  error?: string;
  purchase_log: SubscriptionPurchase_log[];
  valid_till: string;
  _id: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * Lean version of SubscriptionDocument (type alias of `Subscription`)
 *
 * Use this type alias to avoid conflicts with model names:
 * ```
 * import { Subscription } from "../models"
 * import { SubscriptionObject } from "../interfaces/mongoose.gen.ts"
 *
 * const subscriptionObject: SubscriptionObject = subscription.toObject();
 * ```
 */
export type SubscriptionObject = Subscription;

/**
 * Mongoose Query type
 *
 * This type is returned from query functions. For most use cases, you should not need to use this type explicitly.
 */
export type SubscriptionQuery = mongoose.Query<
  any,
  SubscriptionDocument,
  SubscriptionQueries
> &
  SubscriptionQueries;

/**
 * Mongoose Query helper types
 *
 * This type represents `SubscriptionSchema.query`. For most use cases, you should not need to use this type explicitly.
 */
export type SubscriptionQueries = {};

export type SubscriptionMethods = {};

export type SubscriptionStatics = {};

/**
 * Mongoose Model type
 *
 * Pass this type to the Mongoose Model constructor:
 * ```
 * const Subscription = mongoose.model<SubscriptionDocument, SubscriptionModel>("Subscription", SubscriptionSchema);
 * ```
 */
export type SubscriptionModel = mongoose.Model<
  SubscriptionDocument,
  SubscriptionQueries
> &
  SubscriptionStatics;

/**
 * Mongoose Schema type
 *
 * Assign this type to new Subscription schema instances:
 * ```
 * const SubscriptionSchema: SubscriptionSchema = new mongoose.Schema({ ... })
 * ```
 */
export type SubscriptionSchema = mongoose.Schema<
  SubscriptionDocument,
  SubscriptionModel,
  SubscriptionMethods,
  SubscriptionQueries
>;

/**
 * Mongoose Subdocument type
 *
 * Type of `SubscriptionDocument["purchase_log"]` element.
 */
export type SubscriptionPurchase_logDocument = mongoose.Types.Subdocument & {
  date_of_purchase: string;
  expired_on: string;
  product_id: string;
  product_name: string;
  price_id: string;
  amount: number;
  payment_method_brand: string;
  card_last4: string;
  _id: mongoose.Types.ObjectId;
};

/**
 * Mongoose Document type
 *
 * Pass this type to the Mongoose Model constructor:
 * ```
 * const Subscription = mongoose.model<SubscriptionDocument, SubscriptionModel>("Subscription", SubscriptionSchema);
 * ```
 */
export type SubscriptionDocument = mongoose.Document<
  mongoose.Types.ObjectId,
  SubscriptionQueries
> &
  SubscriptionMethods & {
    customer_stripe_id: string;
    stripe_subscription_id: string;
    user_id: UserDocument["_id"] | UserDocument;
    product_name: "trial" | "personal" | "team" | "enterprise";
    usuage: {
      link_generated: number;
      custom_domains: number;
      landing_pages: number;
      workspaces: number;
      teams: number;
      last_interval_date: string;
    };
    product_id: string;
    plan_name: "trial" | "monthly" | "annual";
    price_id: string;
    price: number;
    currency: "ruppee" | "dollar";
    interval_value: number;
    interval_decimal: "day" | "month" | "year";
    status: "OK" | "PAYMENT METHOD ERROR" | "PLAN ENDED";
    error?: string;
    purchase_log: mongoose.Types.DocumentArray<SubscriptionPurchase_logDocument>;
    valid_till: string;
    _id: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
  };

/**
 * Lean version of UserPayment_methodDocument
 *
 * This has all Mongoose getters & functions removed. This type will be returned from `UserDocument.toObject()`.
 * ```
 * const userObject = user.toObject();
 * ```
 */
export type UserPayment_method = {
  pm_type: string;
  brand: string;
  last_4_card_digits: string;
  expiry_month: number;
  expiry_year: number;
  _id: mongoose.Types.ObjectId;
};

/**
 * Lean version of UserAddressDocument
 *
 * This has all Mongoose getters & functions removed. This type will be returned from `UserDocument.toObject()`.
 * ```
 * const userObject = user.toObject();
 * ```
 */
export type UserAddress = {
  city: string;
  line1: string;
  line2: string | null;
  postal_code: string;
  state: string;
  _id: mongoose.Types.ObjectId;
};

/**
 * Lean version of UserBilling_addressDocument
 *
 * This has all Mongoose getters & functions removed. This type will be returned from `UserDocument.toObject()`.
 * ```
 * const userObject = user.toObject();
 * ```
 */
export type UserBilling_address = {
  city: string;
  line1: string;
  line2: string | null;
  postal_code: string;
  state: string;
  _id: mongoose.Types.ObjectId;
};

/**
 * Lean version of UserDocument
 *
 * This has all Mongoose getters & functions removed. This type will be returned from `UserDocument.toObject()`. To avoid conflicts with model names, use the type alias `UserObject`.
 * ```
 * const userObject = user.toObject();
 * ```
 */
export type User = {
  name: string;
  email: string;
  profile_img: string;
  password: string;
  subscription_id?: Subscription["_id"] | Subscription;
  payment_method: UserPayment_method[];
  generated_links: (ShortendUrl["_id"] | ShortendUrl)[];
  favorites: (ShortendUrl["_id"] | ShortendUrl)[];
  address?: UserBilling_address;
  billing_address?: UserBilling_address;
  googleOAuthId: string;
  githubOAuthId: string;
  customerStripeId: string;
  _id: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * Lean version of UserDocument (type alias of `User`)
 *
 * Use this type alias to avoid conflicts with model names:
 * ```
 * import { User } from "../models"
 * import { UserObject } from "../interfaces/mongoose.gen.ts"
 *
 * const userObject: UserObject = user.toObject();
 * ```
 */
export type UserObject = User;

/**
 * Mongoose Query type
 *
 * This type is returned from query functions. For most use cases, you should not need to use this type explicitly.
 */
export type UserQuery = mongoose.Query<any, UserDocument, UserQueries> &
  UserQueries;

/**
 * Mongoose Query helper types
 *
 * This type represents `UserSchema.query`. For most use cases, you should not need to use this type explicitly.
 */
export type UserQueries = {};

export type UserMethods = {
  comparePassword: (this: UserDocument, ...args: any[]) => any;
};

export type UserStatics = {};

/**
 * Mongoose Model type
 *
 * Pass this type to the Mongoose Model constructor:
 * ```
 * const User = mongoose.model<UserDocument, UserModel>("User", UserSchema);
 * ```
 */
export type UserModel = mongoose.Model<UserDocument, UserQueries> & UserStatics;

/**
 * Mongoose Schema type
 *
 * Assign this type to new User schema instances:
 * ```
 * const UserSchema: UserSchema = new mongoose.Schema({ ... })
 * ```
 */
export type UserSchema = mongoose.Schema<
  UserDocument,
  UserModel,
  UserMethods,
  UserQueries
>;

/**
 * Mongoose Subdocument type
 *
 * Type of `UserDocument["payment_method"]` element.
 */
export type UserPayment_methodDocument = mongoose.Types.Subdocument & {
  pm_type: string;
  brand: string;
  last_4_card_digits: string;
  expiry_month: number;
  expiry_year: number;
  _id: mongoose.Types.ObjectId;
};

/**
 * Mongoose Document type
 *
 * Pass this type to the Mongoose Model constructor:
 * ```
 * const User = mongoose.model<UserDocument, UserModel>("User", UserSchema);
 * ```
 */
export type UserAddressDocument = mongoose.Document<mongoose.Types.ObjectId> & {
  city: string;
  line1: string;
  line2: string | null;
  postal_code: string;
  state: string;
  _id: mongoose.Types.ObjectId;
};

/**
 * Mongoose Document type
 *
 * Pass this type to the Mongoose Model constructor:
 * ```
 * const User = mongoose.model<UserDocument, UserModel>("User", UserSchema);
 * ```
 */
export type UserBilling_addressDocument =
  mongoose.Document<mongoose.Types.ObjectId> & {
    city: string;
    line1: string;
    line2: string | null;
    postal_code: string;
    state: string;
    _id: mongoose.Types.ObjectId;
  };

/**
 * Mongoose Document type
 *
 * Pass this type to the Mongoose Model constructor:
 * ```
 * const User = mongoose.model<UserDocument, UserModel>("User", UserSchema);
 * ```
 */
export type UserDocument = mongoose.Document<
  mongoose.Types.ObjectId,
  UserQueries
> &
  UserMethods & {
    name: string;
    email: string;
    profile_img: string;
    password: string;
    subscription_id?: SubscriptionDocument["_id"] | SubscriptionDocument;
    payment_method: mongoose.Types.DocumentArray<UserPayment_methodDocument>;
    generated_links: mongoose.Types.Array<
      ShortendUrlDocument["_id"] | ShortendUrlDocument
    >;
    favorites: mongoose.Types.Array<
      ShortendUrlDocument["_id"] | ShortendUrlDocument
    >;
    address?: UserBilling_addressDocument;
    billing_address?: UserBilling_addressDocument;
    googleOAuthId: string;
    githubOAuthId: string;
    customerStripeId: string;
    _id: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
  };

/**
 * Check if a property on a document is populated:
 * ```
 * import { IsPopulated } from "../interfaces/mongoose.gen.ts"
 *
 * if (IsPopulated<UserDocument["bestFriend"]>) { ... }
 * ```
 */
export function IsPopulated<T>(doc: T | mongoose.Types.ObjectId): doc is T {
  return doc instanceof mongoose.Document;
}

/**
 * Helper type used by `PopulatedDocument`. Returns the parent property of a string
 * representing a nested property (i.e. `friend.user` -> `friend`)
 */
type ParentProperty<T> = T extends `${infer P}.${string}` ? P : never;

/**
 * Helper type used by `PopulatedDocument`. Returns the child property of a string
 * representing a nested property (i.e. `friend.user` -> `user`).
 */
type ChildProperty<T> = T extends `${string}.${infer C}` ? C : never;

/**
 * Helper type used by `PopulatedDocument`. Removes the `ObjectId` from the general union type generated
 * for ref documents (i.e. `mongoose.Types.ObjectId | UserDocument` -> `UserDocument`)
 */
type PopulatedProperty<Root, T extends keyof Root> = Omit<Root, T> & {
  [ref in T]: Root[T] extends mongoose.Types.Array<infer U>
    ? mongoose.Types.Array<Exclude<U, mongoose.Types.ObjectId>>
    : Exclude<Root[T], mongoose.Types.ObjectId>;
};

/**
 * Populate properties on a document type:
 * ```
 * import { PopulatedDocument } from "../interfaces/mongoose.gen.ts"
 *
 * function example(user: PopulatedDocument<UserDocument, "bestFriend">) {
 *   console.log(user.bestFriend._id) // typescript knows this is populated
 * }
 * ```
 */
export type PopulatedDocument<DocType, T> = T extends keyof DocType
  ? PopulatedProperty<DocType, T>
  : ParentProperty<T> extends keyof DocType
  ? Omit<DocType, ParentProperty<T>> & {
      [ref in ParentProperty<T>]: DocType[ParentProperty<T>] extends mongoose.Types.Array<
        infer U
      >
        ? mongoose.Types.Array<
            ChildProperty<T> extends keyof U
              ? PopulatedProperty<U, ChildProperty<T>>
              : PopulatedDocument<U, ChildProperty<T>>
          >
        : ChildProperty<T> extends keyof DocType[ParentProperty<T>]
        ? PopulatedProperty<DocType[ParentProperty<T>], ChildProperty<T>>
        : PopulatedDocument<DocType[ParentProperty<T>], ChildProperty<T>>;
    }
  : DocType;

/**
 * Helper types used by the populate overloads
 */
type Unarray<T> = T extends Array<infer U> ? U : T;
type Modify<T, R> = Omit<T, keyof R> & R;

/**
 * Augment mongoose with Query.populate overloads
 */
declare module "mongoose" {
  interface Query<ResultType, DocType, THelpers = {}> {
    populate<T extends string>(
      path: T,
      select?: string | any,
      model?: string | Model<any, THelpers>,
      match?: any
    ): Query<
      ResultType extends Array<DocType>
        ? Array<PopulatedDocument<Unarray<ResultType>, T>>
        : ResultType extends DocType
        ? PopulatedDocument<Unarray<ResultType>, T>
        : ResultType,
      DocType,
      THelpers
    > &
      THelpers;

    populate<T extends string>(
      options: Modify<PopulateOptions, { path: T }> | Array<PopulateOptions>
    ): Query<
      ResultType extends Array<DocType>
        ? Array<PopulatedDocument<Unarray<ResultType>, T>>
        : ResultType extends DocType
        ? PopulatedDocument<Unarray<ResultType>, T>
        : ResultType,
      DocType,
      THelpers
    > &
      THelpers;
  }
}

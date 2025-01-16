import { Request, Response } from 'express';
import { UserModel } from '@/models/user.model';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '@/utils/CustomErrors';
import { createTokenUser } from '@/utils/createTokenUser';
import { createJWT } from '@/utils/jwt';
import {
  ChangePasswordSchema,
  LoginDtoSchema,
  RegisterDtoSchema,
  RequestPasswordResetTokenSchema,
} from '@/dto/auth.dto';
import stripe from '@/config/stripe';
import { Subscription, User, UserDocument } from '@/types/mongoose-types';
import { APIResponseObj } from '@/types/controllers/index';
import { Container } from 'typedi';
import { SubscriptionService } from '@/services/subscription.service';
import { getAllPlans } from '@/utils/subscription_plans/helpers';
import dayjs from 'dayjs';

export class AuthController {
  public async register(
    req: Request,
    res: Response<APIResponseObj<{ user: any; token: string }>>
  ) {
    const { email, name, password, profile_img } = req.body;
    RegisterDtoSchema.parse(req.body);
    // await resetDatabase();
    const emailAlreadyExists = await UserModel.findOne({
      email: email.toLowerCase(),
    });
    if (emailAlreadyExists) {
      throw new BadRequestError('Email already exists');
    }
    const product = getAllPlans()[0];
    const priceId = product.plans.monthly.price_id;
    const stripeCustomer = await stripe.customers.create({
      email: email.toLowerCase(),
      name,
    });
    const stripeSubscription = await stripe.subscriptions.create({
      customer: stripeCustomer.id,
      items: [
        {
          price: priceId,
        },
      ],
      metadata: {
        price_id: priceId,
        product_id: product?.product_id,
        product_name_db: 'trial',
        product_name: product.product_name,
      },
      trial_period_days: 14,
      payment_settings: {
        save_default_payment_method: 'on_subscription',
      },
      trial_settings: {
        end_behavior: {
          missing_payment_method: 'cancel',
        },
      },
    });
    const user: User = await UserModel.create({
      name,
      email: email.toLowerCase(),
      password,
      profile_img:
        profile_img ??
        'https://res.cloudinary.com/testingcloud11/image/upload/v1715438271/file-upload/rnno9ono6n9q4hesjjt4.jpg',
      githubOAuthId: 'null',
      googleOAuthId: 'null',
      customerStripeId: stripeCustomer.id,
    });
    const subscriptionService = Container.get(SubscriptionService);
    const dbSubscription = await subscriptionService.createSubscription({
      customer_stripe_id: stripeCustomer.id,
      status: 'OK',
      product_id: product.product_id,
      product_name: product.db_product_title as Subscription['product_name'],
      price_id: priceId,
      plan_name: 'trial',
      interval_decimal: 'day',
      interval_value: 14,
      stripe_subscription_id: stripeSubscription.id,
      price: 0,
      purchase_log: [],
      usuage: {
        link_generated: 0,
        landing_pages: 0,
        custom_domains: 0,
        workspaces: 0,
        teams: 0,
        last_interval_date: dayjs(new Date()).toString(),
      },
      currency: 'dollar',
      user_id: user._id.toString(),
    });
    await UserModel.findByIdAndUpdate(user._id, {
      subscription_id: dbSubscription._id,
    });
    if (!user) throw new BadRequestError('Something went wrong');
    const tokenUser = createTokenUser(user);
    const token = createJWT({ payload: tokenUser });
    res.status(StatusCodes.CREATED).json({
      status: 'success',
      data: {
        user,
        token,
      },
    });
  }

  public async login(
    req: Request,
    res: Response<APIResponseObj<{ user: User; token: string }>>
  ) {
    const { email, password } = req.body;
    if (!email) throw new BadRequestError('Please provide email');
    if (!password) throw new BadRequestError('Please provide password');
    LoginDtoSchema.parse(req.body);
    const user: UserDocument | null = await UserModel.findOne({
      email: email.toLowerCase(),
    }).select('+password');

    if (!user) {
      throw new BadRequestError('Email not found');
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new BadRequestError('Password is incorrect');
    }
    const tokenUser = createTokenUser(user);
    const token = createJWT({ payload: tokenUser });
    res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        user,
        token,
      },
    });
  }

  public async logout(
    req: Request,
    res: Response<APIResponseObj<{ msg: string }>>
  ) {
    res.cookie('token', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now() + 1000),
    });
    res
      .status(StatusCodes.OK)
      .json({ data: { msg: 'user logged out!' }, status: 'success' });
  }

  public async requestForPasswordResetToken(req: Request, res: Response) {
    const { email } = req.body;
    if (!email || email === '' || typeof email === 'undefined')
      throw new BadRequestError('Email provided is not valid');
    RequestPasswordResetTokenSchema.parse(req.body);
    const emailExist = await UserModel.findOne({ email });
    if (!emailExist) throw new BadRequestError('Email not found');
    const tokenUser = createTokenUser(emailExist);
    const resetToken = createJWT({ payload: tokenUser });
    await emailExist.save({ validateBeforeSave: false });
    res.status(StatusCodes.OK).json({ resetToken });
  }

  public async changePassword(req: Request, res: Response) {
    const { newPassword, confirmPassword } = req.body;
    ChangePasswordSchema.parse(req.body);
    if (newPassword !== confirmPassword)
      throw new BadRequestError('Passwords do not match');
    const user = await UserModel.findById(req?.User?.userId);
    if (!user) throw new NotFoundError('UserModel not found');
    user.password = newPassword;
    await user.save();
    res.status(StatusCodes.OK).json({ msg: 'Password updated successfully' });
  }

  public googleAuthCallback(
    req: Request,
    res: Response<APIResponseObj<{ user: User; token: string }>>
  ) {
    const { user, token } = req.user as any;
    res.json({ status: 'success', data: { user, token } });
  }

  public githubAuthCallback(
    req: Request,
    res: Response<APIResponseObj<{ user: User; token: string }>>
  ) {
    const { user, token } = req.user as any;
    res.json({ status: 'success', data: { user, token } });
  }
}

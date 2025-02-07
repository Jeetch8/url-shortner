import 'dotenv/config';
import { faker } from '@faker-js/faker';
import {
  ShortendUrlModel,
  UserModel,
  StatModel,
  SubscriptionModel,
} from '../models';
import stripe from '@/config/stripe';
import mongoose from 'mongoose';
import { getAllPlans } from '@/utils/subscription_plans/helpers';
import dayjs from 'dayjs';

const referesArray = [
  'https://www.google.com/',
  'https://www.youtube.com/',
  'https://www.facebook.com/',
  'https://www.bing.com/',
  'https://www.yahoo.com/',
  'https://www.amazon.com/',
  'https://www.wikipedia.org/',
  'https://www.twitter.com/',
  'https://www.linkedin.com/',
  'https://www.instagram.com/',
  'https://www.pinterest.com/',
  'https://www.reddit.com/',
  'https://www.tumblr.com/',
  'https://www.flickr.com/',
  'https://www.snapchat.com/',
  'https://www.twitch.tv/',
  'https://www.spotify.com/',
  'https://www.netflix.com/',
  'https://www.hulu.com/',
  'https://www.disneyplus.com/',
  'https://www.primevideo.com/',
  'https://www.hbo.com/',
  'https://www.apple.com/',
  'https://www.microsoft.com/',
  'https://www.samsung.com/',
  'https://www.huawei.com/',
  'https://www.sony.com/',
  'https://www.nintendo.com/',
  'https://www.playstation.com/',
  'https://www.xbox.com/',
  'https://www.steam.com/',
  'https://www.epicgames.com/',
  'https://www.ubisoft.com/',
  'https://www.activision.com/',
  'https://www.ea.com/',
  'https://www.riotgames.com/',
  'https://www.blizzard.com/',
  'https://www.valve.com/',
  'https://www.rockstargames.com/',
  'https://www.bandainamco.com/',
  'https://www.squareenix.com/',
  'https://www.konami.com/',
  'https://www.capcom.com/',
  'https://www.sega.com/',
  'https://www.atari.com/',
  'https://www.ubisoft.com/',
  'https://www.namco.com/',
  'https://www.taketwo.com/',
  'https://www.koeitecmo.com/',
  'https://www.toyota.com/',
  'https://www.honda.com/',
  'https://www.hyundai.com/',
  'https://www.ford.com/',
  'https://www.chevrolet.com/',
  'https://www.bmw.com',
];

const getFakePaymentMethods = () => {
  return Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
    pm_type: 'card',
    brand: faker.helpers.arrayElement(['visa', 'mastercard', 'amex']),
    last_4_card_digits: faker.finance.creditCardNumber('####'),
    expiry_month: faker.number.int({ min: 1, max: 12 }),
    expiry_year: faker.number.int({ min: 2024, max: 2030 }),
  }));
};

const getAddressFake = () => {
  return {
    city: faker.location.city(),
    line1: faker.location.streetAddress(),
    line2: faker.location.secondaryAddress(),
    postal_code: faker.location.zipCode(),
    state: faker.location.state(),
  };
};

const getUserFake = async ({
  name,
  email,
  profile_img,
}: {
  name?: string;
  email?: string;
  profile_img?: string;
}) => {
  const emailUser = email || faker.internet.email();
  const nameUser = name || faker.person.fullName();
  const profileImgUser = profile_img || faker.image.avatar();
  const stripeCustomer = await stripe.customers.create({
    email: emailUser,
    name: nameUser,
  });

  return {
    name: nameUser,
    email: emailUser,
    profile_img: profileImgUser,
    password: 'PAssword!@12',
    payment_method: getFakePaymentMethods(),
    address: getAddressFake(),
    billing_address: getAddressFake(),
    googleOAuthId: faker.string.uuid(),
    githubOAuthId: faker.string.uuid(),
    customerStripeId: stripeCustomer.id,
    generated_links: [],
    favorites: [],
  };
};

const getSubscriptionFake = async (
  userId: mongoose.Types.ObjectId,
  customerStripeId: string
) => {
  const product = getAllPlans()[0];
  const priceId = product.plans.monthly.price_id;
  const productId = product.product_id;
  const stripeSubscription = await stripe.subscriptions.create({
    customer: customerStripeId,
    items: [{ price: priceId }],
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

  return {
    customer_stripe_id: customerStripeId,
    stripe_subscription_id: stripeSubscription.id,
    user_id: userId,
    product_name: product.db_product_title,
    usuage: {
      link_generated: 0,
      landing_pages: 0,
      custom_domains: 0,
      workspaces: 0,
      teams: 0,
      last_interval_date: dayjs(new Date()).toString(),
    },
    product_id: productId,
    plan_name: 'trial',
    price_id: priceId,
    price: product.plans.monthly.price,
    currency: 'dollar',
    interval_value: 14,
    interval_decimal: 'day',
    status: 'OK',
    purchase_log: [],
    valid_till: dayjs(new Date()).add(14, 'day'),
  };
};
const getStatFake = (shortendUrlId: mongoose.Types.ObjectId) => {
  const clickerInfo = Array.from(
    { length: faker.number.int({ min: 400, max: 1000 }) },
    () => {
      const last30Days = dayjs().subtract(60, 'day');
      const randomDate = faker.date.between({
        from: last30Days.toDate(),
        to: new Date(),
      });
      return {
        ip_address: faker.internet.ip(),
        platform: faker.helpers.arrayElement([
          'Windows',
          'MacOS',
          'Linux',
          'iOS',
          'Android',
        ]),
        device: faker.helpers.arrayElement(['Desktop', 'Mobile', 'Tablet']),
        referrer: faker.helpers.arrayElement(referesArray),
        browser: faker.helpers.arrayElement([
          'Chrome',
          'Firefox',
          'Safari',
          'Edge',
        ]),
        location: {
          country: faker.location.country(),
          city: faker.location.city(),
        },
        createdAt: randomDate,
        updatedAt: randomDate,
      };
    }
  );

  return {
    shortend_url_id: String(shortendUrlId),
    total_clicks: clickerInfo.length,
    clicker_info: clickerInfo,
  };
};

const getShortendUrlFake = (userId: mongoose.Types.ObjectId) => {
  return {
    link_title: faker.lorem.words(3),
    link_description: faker.lorem.sentence(),
    original_url: faker.internet.url(),
    link_enabeld: true,
    shortend_url_cuid: faker.string.alphanumeric(8),
    creator_id: userId,
    link_cloaking: false,
    sharing_preview: {
      title: faker.lorem.words(5),
      description: faker.lorem.sentence(),
      image: faker.image.url(),
    },
    tags: [faker.word.noun(), faker.word.noun()],
    protected: {
      enabeld: false,
      password: null,
    },
    link_expiry: {
      enabeld: false,
      link_expires_on: null,
      expiry_redirect_url: null,
    },
    link_targetting: {
      enabeld: false,
      location: {
        country: null,
        redirect_url: null,
      },
      device: {
        ios: null,
        android: null,
        windows: null,
        linux: null,
        mac: null,
      },
      rotate: [],
    },
  };
};

const resetAllStripeData = async () => {
  const stripeCustomers = await stripe.customers.list();
  for (const customer of stripeCustomers.data) {
    await stripe.customers.del(customer.id);
  }
  console.log('✅ Reset all stripe data');
};

const resetDatabase = async () => {
  await UserModel.deleteMany({});
  await ShortendUrlModel.deleteMany({});
  await StatModel.deleteMany({});
  await SubscriptionModel.deleteMany({});
  console.log('✅ Reset all database data');
};

const createStripeUsers = async ({
  email,
  name,
}: {
  email: string;
  name: string;
}) => {
  const stripeCustomer = await stripe.customers.create({ email, name });
  return stripeCustomer;
};

export const seedFakeData = async () => {
  try {
    const uri = process.env.DB_URL;
    await mongoose.connect(uri!).then(() => {
      console.log('Mongodb connected');
    });

    await resetDatabase();
    await resetAllStripeData();

    const userDataPromises = Array.from({ length: 10 }, () => getUserFake({}));
    // Adding demo user
    const userData = await Promise.all(userDataPromises);
    userData.push(
      await getUserFake({
        name: 'Demo User',
        email: 'demo@demo.com',
        profile_img: 'https://i.pravatar.cc/300',
      })
    );
    const createdUsers = await UserModel.create(userData);

    console.log(`✅ Created ${createdUsers.length} fake users`);

    const subscriptionPromises = createdUsers.map((user) =>
      getSubscriptionFake(user._id, user.customerStripeId)
    );
    const subscriptionData = await Promise.all(subscriptionPromises);

    const createdSubscriptions = await SubscriptionModel.create(
      subscriptionData
    );
    for (const subscription of createdSubscriptions) {
      await UserModel.findByIdAndUpdate(subscription.user_id, {
        subscription_id: subscription._id,
      });
    }

    console.log(`✅ Created ${createdSubscriptions.length} fake subscriptions`);

    const shortendUrlData = createdUsers.map((user) => {
      return Array.from({ length: faker.number.int({ min: 5, max: 10 }) }, () =>
        getShortendUrlFake(user.id)
      );
    });
    const createdShortnedUrlData = await ShortendUrlModel.create(
      shortendUrlData.flat()
    );

    for (const url of createdShortnedUrlData) {
      await UserModel.findByIdAndUpdate(url.creator_id, {
        $push: { generated_links: url._id },
      });
    }

    console.log(
      `✅ Created ${createdShortnedUrlData.length} fake ShortrendUrl`
    );
    const statsData = createdShortnedUrlData.map((url) => getStatFake(url._id));
    const createStatsData = await StatModel.create(statsData);
    for (const stat of createStatsData) {
      await ShortendUrlModel.findByIdAndUpdate(stat.shortend_url_id, {
        stats: stat._id,
      });
    }

    console.log(`✅ Created ${createStatsData.length} fake Stats`);

    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedFakeData();

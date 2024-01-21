import { Factory } from "miragejs";
import { faker } from "@faker-js/faker";

const productNames = ["trial", "personal", "team", "enterprise"];
const planNames = ["trial", "monthly", "annual"];
const currencies = ["ruppee", "dollar"];
const intervalDecimals = ["day", "month", "year"];
const statuses = ["OK", "PAYMENT METHOD ERROR", "PLAN ENDED"];

export const SubscriptionFactory = Factory.extend({
  customer_stripe_id() {
    return `cus_${faker.string.alphanumeric(14)}`;
  },
  stripe_subscription_id() {
    return `sub_${faker.string.alphanumeric(14)}`;
  },
  user_id() {
    return faker.string.uuid();
  },
  product_name() {
    return faker.helpers.arrayElement(productNames);
  },
  usuage() {
    return {
      link_generated: faker.number.int({ min: 0, max: 1000 }),
      custom_domains: faker.number.int({ min: 0, max: 10 }),
      landing_pages: faker.number.int({ min: 0, max: 50 }),
      workspaces: faker.number.int({ min: 0, max: 5 }),
      teams: faker.number.int({ min: 0, max: 3 }),
      last_interval_date: faker.date.recent().toISOString(),
    };
  },
  product_id() {
    return `prod_${faker.string.alphanumeric(14)}`;
  },
  plan_name() {
    return faker.helpers.arrayElement(planNames);
  },
  price_id() {
    return `price_${faker.string.alphanumeric(14)}`;
  },
  price() {
    return faker.number.float({ min: 0, max: 1000, precision: 0.01 });
  },
  currency() {
    return faker.helpers.arrayElement(currencies);
  },
  interval_value() {
    return faker.number.int({ min: 1, max: 12 });
  },
  interval_decimal() {
    return faker.helpers.arrayElement(intervalDecimals);
  },
  status() {
    return faker.helpers.arrayElement(statuses);
  },
  error() {
    return faker.datatype.boolean() ? faker.lorem.sentence() : undefined;
  },
  purchase_log() {
    return Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
      date_of_purchase: faker.date.past().toISOString(),
      expired_on: faker.date.future().toISOString(),
      product_id: `prod_${faker.string.alphanumeric(14)}`,
      product_name: faker.helpers.arrayElement(productNames),
      price_id: `price_${faker.string.alphanumeric(14)}`,
      amount: faker.number.float({ min: 0, max: 1000, precision: 0.01 }),
      payment_method_brand: faker.finance.creditCardIssuer(),
      card_last4: faker.finance.creditCardNumber("####"),
    }));
  },
  valid_till() {
    return faker.date.future().toISOString();
  },
  createdAt() {
    return faker.date.past();
  },
  updatedAt() {
    return faker.date.recent();
  },
});

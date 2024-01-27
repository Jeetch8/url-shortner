import { Factory } from "miragejs";
import { faker } from "@faker-js/faker";

export const UserFactory = Factory.extend({
  name() {
    return faker.person.fullName();
  },
  email() {
    return faker.internet.email();
  },
  profile_img() {
    return faker.image.avatar();
  },
  password() {
    return faker.internet.password();
  },
  subscription_id() {
    return faker.string.uuid();
  },
  payment_method() {
    return Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
      pm_type: faker.finance.creditCardIssuer(),
      brand: faker.finance.creditCardIssuer(),
      last_4_card_digits: faker.finance.creditCardNumber("####"),
      expiry_month: faker.number.int({ min: 1, max: 12 }),
      expiry_year: faker.date.future().getFullYear(),
    }));
  },
  generated_links() {
    return faker.helpers.multiple(faker.string.uuid, {
      count: { min: 0, max: 10 },
    });
  },
  favorites() {
    return faker.helpers.multiple(faker.string.uuid, {
      count: { min: 0, max: 5 },
    });
  },
  address() {
    return {
      city: faker.location.city(),
      line1: faker.location.streetAddress(),
      line2: faker.datatype.boolean()
        ? faker.location.secondaryAddress()
        : null,
      postal_code: faker.location.zipCode(),
      state: faker.location.state(),
    };
  },
  billing_address() {
    return {
      city: faker.location.city(),
      line1: faker.location.streetAddress(),
      line2: faker.datatype.boolean()
        ? faker.location.secondaryAddress()
        : null,
      postal_code: faker.location.zipCode(),
      state: faker.location.state(),
    };
  },
  googleOAuthId() {
    return faker.string.uuid();
  },
  githubOAuthId() {
    return faker.string.uuid();
  },
  customerStripeId() {
    return `cus_${faker.string.alphanumeric(14)}`;
  },
  createdAt() {
    return faker.date.past();
  },
  updatedAt() {
    return faker.date.recent();
  },
});

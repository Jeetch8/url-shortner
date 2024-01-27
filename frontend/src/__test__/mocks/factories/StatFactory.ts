import { Factory } from "miragejs";
import { faker } from "@faker-js/faker";

const plaforms = ["Windows", "Linux", "Mac", "Android", "iOS"];
const devices = ["Desktop", "Mobile", "Tablet"];

export const StatFactory = Factory.extend({
  shortend_url_id() {
    return faker.string.uuid();
  },
  total_clicks() {
    return faker.number.int({ min: 0, max: 1000 });
  },
  clicker_info() {
    return Array.from(
      { length: faker.number.int({ min: 1, max: 10 }) },
      () => ({
        ip_address: faker.internet.ip(),
        platform: faker.helpers.arrayElement(plaforms),
        device: faker.helpers.arrayElement(devices),
        referrer: faker.internet.url(),
        browser: faker.internet.userAgent(),
        location: {
          country: faker.location.country(),
          city: faker.location.city(),
        },
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      })
    );
  },
  createdAt() {
    return faker.date.past();
  },
  updatedAt() {
    return faker.date.recent();
  },
});

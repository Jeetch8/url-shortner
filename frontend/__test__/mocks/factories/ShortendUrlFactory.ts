import { Factory } from "miragejs";
import { faker } from "@faker-js/faker";

export const ShortendUrlFactory = Factory.extend({
  link_title() {
    return faker.lorem.words();
  },
  link_description() {
    return faker.lorem.sentence();
  },
  original_url() {
    return faker.internet.url();
  },
  link_enabled() {
    return faker.datatype.boolean();
  },
  shortend_url_cuid() {
    return faker.string.alphanumeric(10);
  },
  creator_id() {
    return faker.string.uuid();
  },
  link_cloaking() {
    return faker.datatype.boolean();
  },
  sharing_preview() {
    return {
      title: faker.lorem.words(),
      description: faker.lorem.sentence(),
      image: faker.image.url(),
    };
  },
  tags() {
    return faker.helpers.multiple(faker.word.sample, {
      count: { min: 0, max: 5 },
    });
  },
  protected() {
    return {
      enabled: faker.datatype.boolean(),
      password: faker.internet.password(),
    };
  },
  link_expiry() {
    return {
      enabled: faker.datatype.boolean(),
      link_expires_on: faker.date.future().toISOString(),
      expiry_redirect_url: faker.internet.url(),
    };
  },
  link_targetting() {
    return {
      enabled: faker.datatype.boolean(),
      location: faker.location.country(),
      device: {
        ios: faker.internet.url(),
        android: faker.internet.url(),
        windows: faker.internet.url(),
        linux: faker.internet.url(),
        mac: faker.internet.url(),
      },
      rotate: faker.helpers.multiple(faker.internet.url, {
        count: { min: 1, max: 5 },
      }),
    };
  },
  stats() {
    return faker.string.uuid();
  },
  createdAt() {
    return faker.date.past();
  },
  updatedAt() {
    return faker.date.recent();
  },
});

import { Factory } from "miragejs";
import { faker } from "@faker-js/faker";

export const LinkStatFactory = Factory.extend({
  stats() {
    return {
      totalClicks: faker.number.int({ min: 1000, max: 10000 }),
      clicksType: {
        label: ["Unique", "Non-Unique"],
        data: [
          faker.number.int({ min: 100, max: 1000 }),
          faker.number.int({ min: 100, max: 1000 }),
        ],
      },
      topDays: generateChartsData(7),
      topHours: generateChartsData(24),
      clicksByDays: generateChartsData(7),
      clicksByMonths: generateChartsData(12),
      clicksByHours: generateChartsData(24),
      devices: {
        label: ["Mobile", "Tablet", "Desktop", "others"],
        data: Array.from({ length: 4 }, () =>
          faker.number.int({ min: 10, max: 100 })
        ),
      },
      referrer: generateChartsData(5),
      platform: generateChartsData(5),
      browser: {
        label: ["Chrome", "Firefox", "Mozilla", "Others"],
        data: Array.from({ length: 4 }, () =>
          faker.number.int({ min: 10, max: 100 })
        ),
      },
      location: Array.from({ length: 10 }, () => ({
        country: faker.location.country(),
        value: faker.number.int({ min: 10, max: 1000 }),
      })),
    };
  },
  logs() {
    return Array.from(
      { length: faker.number.int({ min: 20, max: 40 }) },
      () => ({
        browser: faker.helpers.arrayElement([
          "Chrome",
          "Firefox",
          "Safari",
          "Edge",
        ]),
        platform: faker.helpers.arrayElement([
          "Windows",
          "MacOS",
          "Linux",
          "iOS",
          "Android",
        ]),
        referrer: faker.internet.url(),
        location: {
          country: faker.location.country(),
          city: faker.location.city(),
        },
        date: {
          elDate: faker.date.recent().toISOString().split("T")[0],
          elTime: faker.date.recent().toTimeString().split(" ")[0],
        },
      })
    );
  },
});

function generateChartsData(length: number): {
  label: string[];
  data: number[];
} {
  return {
    label: Array.from({ length }, () => faker.word.sample()),
    data: Array.from({ length }, () =>
      faker.number.int({ min: 10, max: 1000 })
    ),
  };
}

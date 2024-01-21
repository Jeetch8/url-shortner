import { createServer, Model } from "miragejs";
import { StatFactory } from "./factories/StatFactory";
import { ShortendUrlFactory } from "./factories/ShortendUrlFactory";
import { UserFactory } from "./factories/UserFactory";
import { SubscriptionFactory } from "./factories/SubscriptionFactory";

export function makeServer({ environment = "test" } = {}) {
  const server = createServer({
    environment,

    models: {
      stat: Model,
      shortendUrl: Model,
      user: Model,
      subscription: Model,
    },

    factories: {
      stat: StatFactory,
      shortendUrl: ShortendUrlFactory,
      user: UserFactory,
      subscription: SubscriptionFactory,
    },

    seeds(server) {
      server.createList("stat", 10);
      server.createList("shortendUrl", 20);
      server.createList("user", 5);
      server.createList("subscription", 5);
    },

    routes() {
      this.namespace = "/api";

      this.get("/stats", (schema) => {
        return schema.all("stat");
      });

      this.get("/shortend-urls", (schema) => {
        return schema.all("shortendUrl");
      });

      this.get("/users", (schema) => {
        return schema.all("user");
      });

      this.get("/subscriptions", (schema) => {
        return schema.all("subscription");
      });

      this.get("/hooktesturl", (schema) => {
        return { msg: "test" };
      });

      this.post("/hooktesturl", (schema, request) => {
        return { msg: "test" };
      });

      this.delete("/hooktesturl", (schema, request) => {
        return { msg: "test" };
      });

      this.put("/hooktesturl", (schema, request) => {
        return { msg: "test" };
      });

      // this.passthrough();
    },
  });

  return server;
}

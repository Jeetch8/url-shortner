import { createServer, Model } from "miragejs";
import { StatFactory } from "./factories/StatFactory";
import { ShortendUrlFactory } from "./factories/ShortendUrlFactory";
import { UserFactory } from "./factories/UserFactory";
import { SubscriptionFactory } from "./factories/SubscriptionFactory";
import { base_url } from "../../src/utils/base_url";

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
      this.urlPrefix = "http://localhost:5000";
      this.namespace = "/api/v1";

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

      this.get("/hooktesturl", () => {
        return { data: { msg: "test" } };
      });

      this.post("/hooktesturl", () => {
        return { data: { msg: "test" } };
      });

      this.delete("/hooktesturl", () => {
        return { data: { msg: "test" } };
      });

      this.put("/hooktesturl", () => {
        return { data: { msg: "test" } };
      });

      this.patch("/user/favorite", (schema, req) => {
        console.log(req.requestBody, "server called");
        return { data: { favorite: true } };
      });
    },
  });

  return server;
}

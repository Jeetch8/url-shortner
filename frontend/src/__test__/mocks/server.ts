import { createServer, Model } from "miragejs";
import { StatFactory } from "./factories/StatFactory";
import { ShortendUrlFactory } from "./factories/ShortendUrlFactory";
import { UserFactory } from "./factories/UserFactory";
import { SubscriptionFactory } from "./factories/SubscriptionFactory";
import plans from "../../../../admin_backend/src/utils/subscription_plans/plans.json";
import { LinkStatFactory } from "./factories/LinkStatFactory";

export function makeServer({ environment = "test" } = {}) {
  const server = createServer({
    environment,

    models: {
      stat: Model,
      shortendUrl: Model,
      user: Model,
      subscription: Model,
      linkStat: Model,
    },

    factories: {
      stat: StatFactory,
      shortendUrl: ShortendUrlFactory,
      user: UserFactory,
      subscription: SubscriptionFactory,
      linkStat: LinkStatFactory,
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

      this.get("/url", (schema) => {
        const linksQuery = server.createList("shortendUrl", 5);
        const links = linksQuery.map((el) => el.attrs);
        const data = { generated_links: links };
        return { status: "success", data };
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

      this.get("/dashboard/link/1", (schema, request) => {
        return { data: server.create("linkStat").attrs };
      });

      this.get("/user/bootup", (schema, request) => {
        const user = server.create("user").attrs;
        const subscription = server.create("subscription").attrs;
        const product = plans.plans[0];
        const data = {
          data: {
            user: {
              ...user,
              subscription_id: subscription,
            },
            subscription_warninig: {
              visible: true,
              text: "Your subscription is about to end",
              plan_end: true,
              type: "warning",
            },
            product: {
              ...product,
              plan_name: "monthly",
            },
          },
        };
        return data;
      });
    },
  });

  return server;
}

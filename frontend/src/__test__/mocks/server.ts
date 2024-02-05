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
      server.create("linkStat");
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

      this.get("/url/:linkId", (schema, request) => {
        const linkId = request.params.linkId;
        const shortend_url = server.create("shortendUrl", {
          _id: linkId,
          protected: { enabled: false, password: "" },
          link_expiry: {
            enabled: false,
            expiry_redirect_url: "",
            link_expires_on: "",
          },
          sharing_preview: {
            enabled: false,
          },
        }).attrs;
        return { data: { link: shortend_url }, status: "success" };
      });

      this.patch("/user/favorite", (schema, req) => {
        return { data: { favorite: true } };
      });

      this.get("/dashboard/link/test1", (schema, request) => {
        const data = server.create("linkStat").attrs;
        const shortend_url = server.create("shortendUrl").attrs;
        return { data: { ...data, shortend_url } };
      });

      this.get("/user/me", (schema) => {
        const user = server.create("user").attrs;
        return {
          data: { user },
          status: "success",
        };
      });

      this.post("/auth/login", () => {
        const user = server.create("user").attrs;
        const data = { user, token: "testtoken" };
        return { status: "success", data };
      });

      this.get("/user/stats", (schema) => {
        return {
          status: "success",
          data: {
            total_clicks: 1523,
            generated_links: 15,
            clicks: {
              label: [
                "17-07",
                "18-07",
                "19-07",
                "20-07",
                "21-07",
                "22-07",
                "23-07",
              ],
              data: [45, 67, 89, 102, 78, 56, 94],
              borderColor: "green",
            },
            clicks_last7days: 531,
            referrer: [
              { label: "facebook.com", value: 203 },
              { label: "twitter.com", value: 156 },
              { label: "linkedin.com", value: 98 },
              { label: "instagram.com", value: 74 },
            ],
            browser: {
              Chrome: 312,
              Firefox: 98,
              Safari: 87,
              Edge: 34,
            },
            location: [
              { country: "United States", value: 245 },
              { country: "United Kingdom", value: 132 },
              { country: "Canada", value: 87 },
              { country: "Germany", value: 67 },
            ],
            devices: [
              { label: "Desktop", value: 312 },
              { label: "Mobile", value: 187 },
              { label: "Tablet", value: 32 },
            ],
          },
        };
      });

      this.get("/user/bootup", (schema, request) => {
        const user = server.create("user").attrs;
        const subscription = server.create("subscription").attrs;
        const product = plans.plans[1];
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

      this.post("/auth/register", () => {
        const user = server.create("user").attrs;
        return {
          status: "success",
          data: {
            user,
            token: "testtoken",
          },
        };
      });

      this.patch("/url/:linkId", (schema, req) => {
        return {
          status: "success",
          data: {
            msg: "Link updated successfully",
            link: { slug: req.params.linkId },
          },
        };
      });
    },
  });

  return server;
}

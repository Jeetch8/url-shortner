import { screen, render, waitFor } from "@testing-library/react";
import BillingAndUsuage from "@/pages/BillingAndUsuage";
import { Server } from "miragejs";
import plans from "../../../../admin_backend/src/utils/subscription_plans/plans.json";
import { makeServer } from "../mocks/server";
import { wrapper } from "../Providers";
import { mockRequestResponse } from "../utils";
import { AcceptedMethods } from "@/hooks/useFetch";
import {
  SubscriptionDocument,
  UserDocument,
} from "@shared/types/mongoose-types";

const createUserbootupData = (server: Server, productIndex: number) => {
  const user = server.create("user").attrs as UserDocument;
  const subscription = server.create("subscription")
    .attrs as SubscriptionDocument;
  const product = plans.plans[productIndex];
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
    status: "success",
  };
  return data;
};

const mockNavigate = vi.fn();
vi.spyOn(Storage.prototype, "getItem").mockResolvedValue("token");
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderComponent = () => {
  return {
    ...render(<BillingAndUsuage />, { wrapper }),
  };
};

describe("Testing BillingAndUsuage Page", () => {
  let server: Server;

  beforeEach(() => {
    server = makeServer({ environment: "test" });
  });

  afterEach(() => {
    server.shutdown();
  });

  it("Should render page", () => {
    renderComponent();
  });

  const planDetailsComp = (title?: string) => {
    return {
      title: screen.getByRole("heading", {
        name: RegExp(title ?? /Personal pack/i, "i"),
      }),
      linkGeneration: screen.getByText(/link generations/i),
      landingPages: screen.getByText(/landing pages/i),
      linkCloaking: screen.getByText(/link cloaking/i),
      linkStats: screen.getByText(/link stats/i),
      linkExpiration: screen.getByText(/link password protection/i),
    };
  };

  it("Should render plan details component", async () => {
    renderComponent();
    const planDetails = screen.getByLabelText("plan details comp");
    const loader = screen.getByTestId("loader");
    expect(loader).toBeInTheDocument();
    await waitFor(() => {
      expect(loader).not.toBeInTheDocument();
      planDetailsComp();
    });
  });

  it.each([
    { index: 0, packageName: "personal" },
    { index: 1, packageName: "team" },
    { index: 2, packageName: "enterprise" },
  ])(
    "Should render plan details icons and data based on subscription = $packageName",
    async ({ index }) => {
      const data = createUserbootupData(server, index);
      mockRequestResponse({
        server,
        route: "/user/bootup",
        method: AcceptedMethods.GET,
        data,
      });
      renderComponent();
      const loader = screen.getByTestId("loader");
      await waitFor(() => {
        expect(loader).not.toBeInTheDocument();
      });
      const productdata = data.data.product;
      const {
        linkGeneration,
        landingPages,
        linkCloaking,
        linkExpiration,
        linkStats,
      } = planDetailsComp(data.data.product.plan_name);
      expect(linkGeneration).toHaveTextContent(
        RegExp(String(productdata.features.link_generation), "i")
      );
      expect(landingPages).toHaveTextContent(
        RegExp(String(productdata.features.landing_page), "i")
      );
      expect(landingPages.parentElement?.children.item(0)).toHaveRole(
        "check_icon"
      );
      if (productdata.features.link_cloaking)
        expect(linkCloaking.parentElement?.children.item(0)).toHaveRole(
          "check_icon"
        );
      else
        expect(linkCloaking.parentElement?.children.item(0)).toHaveRole(
          "cross_icon"
        );
      if (productdata.features.link_expiration)
        expect(linkExpiration.parentElement?.children.item(0)).toHaveRole(
          "check_icon"
        );
      else
        expect(linkExpiration.parentElement?.children.item(0)).toHaveRole(
          "cross_icon"
        );
      if (productdata.features.link_stats)
        expect(linkStats.parentElement?.children.item(0)).toHaveRole(
          "check_icon"
        );
      else
        expect(linkStats.parentElement?.children.item(0)).toHaveRole(
          "cross_icon"
        );
    }
  );

  it("Should render usuage details", async () => {
    const data = createUserbootupData(server, 1);
    mockRequestResponse({
      server,
      route: "/user/bootup",
      method: AcceptedMethods.GET,
      data,
    });
    renderComponent();
    const loader = screen.getByTestId("loader");
    await waitFor(() => {
      expect(loader).not.toBeInTheDocument();
    });
    const productData = data.data.product;
    screen.debug(undefined, 300000);
    console.log(data.data.user.generated_links.length);
    expect(
      screen.getByText(
        RegExp(
          `${data.data.user.generated_links.length} of ${productData.features.link_generation} used`
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        RegExp(`0 of ${productData.features.custom_domains} used`)
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(RegExp(`1 of ${productData.features.workspaces} used`))
    ).toBeInTheDocument();
    expect(
      screen.getByText(RegExp(`1 of ${productData.features.team_members} used`))
    ).toBeInTheDocument();
  });

  it("Should render billing history table", async () => {
    const data = createUserbootupData(server, 1);
    mockRequestResponse({
      server,
      route: "/user/bootup",
      method: AcceptedMethods.GET,
      data,
    });
    renderComponent();
    const loader = screen.getByTestId("loader");
    await waitFor(() => {
      expect(loader).not.toBeInTheDocument();
    });
    const purchaseLogs = data.data.user.subscription_id.purchase_log;
    const rows = screen.getAllByRole("row");
    expect(rows.length).toBe(purchaseLogs.length + 1);
    rows.forEach((el, ind) => {
      const log = purchaseLogs[ind + 1];
      if (log) {
        const text = `${log.product_name.toUpperCase()} ${log.card_last4}$ ${
          log.amount
        }${new Date(log.date_of_purchase).toDateString()}${new Date(
          log.expired_on
        ).toDateString()}`;
        expect(el.textContent).toEqual(text);
      }
    });
    console.log(rows[1].textContent);
  });
});

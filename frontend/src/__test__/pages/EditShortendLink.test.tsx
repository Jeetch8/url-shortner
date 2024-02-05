import { screen, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditShortendLink from "../../pages/EditShortendLink";
import { wrapper } from "../Providers";
import { Server } from "miragejs";
import { makeServer } from "../mocks/server";
import plans from "../../../../admin_backend/src/utils/subscription_plans/plans.json";
import { mockErrorResponse, mockRequestResponse } from "../utils";
import { AcceptedMethods } from "@/hooks/useFetch";
import { debug } from "vitest-preview";

const createUserbootupData = (server: Server, index: number) => {
  const user = server.create("user").attrs;
  const subscription = server.create("subscription").attrs;
  const product = plans.plans[index];
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
const mockUseLocationPathname = vi
  .fn()
  .mockResolvedValue({ pathname: "/links/test1" });
vi.spyOn(Storage.prototype, "getItem").mockResolvedValue("token");
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockUseLocationPathname,
    useParams: () => {
      return {
        linkId: "test1",
      };
    },
  };
});

const renderComponent = () => {
  const user = userEvent.setup();
  return {
    ...render(<EditShortendLink />, { wrapper }),
    linkEnabledToggler: screen.getByLabelText(
      /link enabeld toggler/i
    ) as HTMLInputElement,
    urlSlugInput: screen.getByRole("textbox", { name: /url slug/i }),
    originalLinkInput: screen.getByRole("textbox", {
      name: /original url field/i,
    }),
    passwordProtectedToggler: screen.getByLabelText(
      /password protection enabeld toggler/i
    ),
    linkCloakingToggler: screen.getByLabelText(
      /Link cloaking enabeld toggler/i
    ),
    linkExpiryToggler: screen.getByLabelText(/Link expiry enabeld toggler/i),
    customLinkPreviewToggler: screen.getByLabelText(
      /custom link preview enabeld toggler/i
    ),
    user,
  };
};

describe("Testing EditShortendLink page", () => {
  let server: Server;

  beforeEach(() => {
    server = makeServer({ environment: "test" });
  });

  afterEach(() => {
    server.shutdown();
  });

  it("Should render all main visible elements", async () => {
    const data = createUserbootupData(server, 2);
    mockRequestResponse({
      server,
      route: "/user/bootup",
      method: AcceptedMethods.GET,
      data,
    });
    const {
      passwordProtectedToggler,
      user,
      linkExpiryToggler,
      customLinkPreviewToggler,
    } = renderComponent();
    await waitFor(() => {
      expect(passwordProtectedToggler).not.toBeDisabled();
    });
    await user.click(linkExpiryToggler);
    debug();
    expect(screen.getByLabelText(/date picker/i)).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", {
        name: /Redirect URL after link expiraties field/i,
      })
    ).toBeInTheDocument();
    await user.click(customLinkPreviewToggler);
  });

  it.each([
    { productName: "personal", index: 0 },
    { productName: "team", index: 1 },
    { productName: "enterprise", index: 2 },
  ])(
    "Should disable the fields according to the user's subscription ($productName)",
    async ({ index }) => {
      const data = createUserbootupData(server, index);
      mockRequestResponse({
        server,
        route: "/user/bootup",
        method: AcceptedMethods.GET,
        data,
      });
      const {
        passwordProtectedToggler,
        linkExpiryToggler,
        customLinkPreviewToggler,
      } = renderComponent();
      await waitFor(() => {
        if (data.data.product.features.link_password_protection)
          expect(passwordProtectedToggler).not.toBeDisabled();
        else expect(passwordProtectedToggler).toBeDisabled();
        if (data.data.product.features.link_expiration)
          expect(linkExpiryToggler).not.toBeDisabled();
        else expect(linkExpiryToggler).toBeDisabled();
        if (data.data.product.features.custom_link_sharing_preview)
          expect(customLinkPreviewToggler).not.toBeDisabled();
        else expect(customLinkPreviewToggler).toBeDisabled();
      });
    }
  );

  it("Should send modified data to the server", async () => {
    const data = createUserbootupData(server, 2);
    mockRequestResponse({
      server,
      route: "/user/bootup",
      method: AcceptedMethods.GET,
      data,
    });
    const { passwordProtectedToggler, urlSlugInput, originalLinkInput } =
      renderComponent();
    await waitFor(() => {
      expect(passwordProtectedToggler).not.toBeDisabled();
    });
    await userEvent.clear(urlSlugInput);
    await userEvent.type(urlSlugInput, "test12");
    await userEvent.click(
      screen.getByRole("button", { name: /save changes/i })
    );
    debug();
    await waitFor(() => {
      expect(screen.getByText(/Changes saved/i)).toBeInTheDocument();
      expect(mockNavigate).toHaveBeenCalledWith("/links/test1");
    });
  });
});

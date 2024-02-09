import { screen, render } from "@testing-library/react";
import Settings from "@/pages/Settings";
import { Server } from "miragejs";
import { makeServer } from "../mocks/server";
import { wrapper } from "../Providers";
import {
  SubscriptionDocument,
  UserDocument,
} from "@shared/types/mongoose-types";
import plans from "../../../../admin_backend/src/utils/subscription_plans/plans.json";
import { mockErrorResponse, mockRequestResponse } from "../utils";
import { AcceptedMethods } from "@/hooks/useFetch";
import userEvent from "@testing-library/user-event";
import { debug } from "vitest-preview";

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

const storageClearMock = vi.spyOn(Storage.prototype, "clear").mockReturnValue();

const mockUserbootupResp = (server: Server, productIndex: number) => {
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
  mockRequestResponse({
    server,
    route: "/user/bootup",
    method: AcceptedMethods.GET,
    data,
  });
  return data;
};

const renderComponent = async () => {
  return {
    ...render(<Settings />, { wrapper }),
    avatarEl: await screen.findByRole("avatar"),
    changeProfileImg: await screen.findByRole("button", {
      name: /change image/i,
    }),
    nameInput: (await screen.findByPlaceholderText(
      /name/i
    )) as HTMLInputElement,
    emailInput: (await screen.findByPlaceholderText(
      /email/i
    )) as HTMLInputElement,
    saveChangeBtn: await screen.findByRole("button", { name: /save/i }),
    currentPasswordInput: screen.getByPlaceholderText(
      /current password/i
    ) as HTMLInputElement,
    newPasswordInput: screen.getByPlaceholderText(
      /Enter new password/i
    ) as HTMLInputElement,
    confirmPasswordInput: screen.getByPlaceholderText(
      /Confirm new password/i
    ) as HTMLInputElement,
    changePasswordBtn: screen.getByRole("button", { name: /change password/i }),
    user: userEvent.setup(),
  };
};

describe("Testing settings page", () => {
  let server: Server;

  beforeEach(() => {
    server = makeServer({ environment: "test" });
  });

  afterEach(() => {
    server.shutdown();
  });

  it("Should render main elements", async () => {
    mockUserbootupResp(server, 0);
    await renderComponent();
  });

  it("Should render user info default values in input fileds", async () => {
    const { data } = mockUserbootupResp(server, 0);
    const { avatarEl, nameInput, emailInput } = await renderComponent();
    const user = data.user;
    expect(avatarEl.style.backgroundImage).toBe(`url(${user.profile_img})`);
    expect(nameInput).toHaveValue(user.name);
    expect(emailInput).toHaveValue(user.email);
  });

  it("Should disable the save changes btn if for is not dirty", async () => {
    const { saveChangeBtn } = await renderComponent();
    expect(saveChangeBtn).toBeDisabled();
  });

  it("Should toast when user profile is updated", async () => {
    const { data } = mockUserbootupResp(server, 0);
    const { saveChangeBtn, nameInput, user } = await renderComponent();
    await user.type(nameInput, "test");
    await user.click(saveChangeBtn);
    expect(nameInput).toHaveValue(data.user.name + "test");
    expect(await screen.findByText(/Profile updated/i)).toBeInTheDocument();
  });

  it("Should toast on successful password change", async () => {
    const {
      confirmPasswordInput,
      currentPasswordInput,
      newPasswordInput,
      changePasswordBtn,
      user,
    } = await renderComponent();
    await user.type(currentPasswordInput, "Jeetk8035!@");
    await user.type(newPasswordInput, "Dipen8035!@");
    await user.type(confirmPasswordInput, "Dipen8035!@");
    await user.click(changePasswordBtn);
    expect(await screen.findByText(/password changed/i)).toBeInTheDocument();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
    expect(storageClearMock).toHaveBeenCalled();
  });

  it("Should show error if currentPassword and newPassword are same", async () => {
    const {
      confirmPasswordInput,
      currentPasswordInput,
      newPasswordInput,
      user,
      changePasswordBtn,
    } = await renderComponent();
    await user.type(currentPasswordInput, "Dipen8035!@");
    await user.type(newPasswordInput, "Dipen8035!@");
    await user.type(confirmPasswordInput, "Dipen8035!@");
    await user.click(changePasswordBtn);
    expect(
      await screen.findByText(/new password cannot be equal/i)
    ).toBeInTheDocument();
  });

  it("should throw validation error if email is not valid", async () => {
    const { emailInput, saveChangeBtn, user } = await renderComponent();
    await user.clear(emailInput);
    await user.type(emailInput, "invalidemail");
    await user.click(saveChangeBtn);
    expect(await screen.findByText(/email is not valid/i)).toBeInTheDocument();
  });

  it("Should show error if new password and confirm password do not match", async () => {
    const {
      confirmPasswordInput,
      currentPasswordInput,
      newPasswordInput,
      changePasswordBtn,
      user,
    } = await renderComponent();
    await user.type(currentPasswordInput, "Jeetk8035!@");
    await user.type(newPasswordInput, "Dipen8035!@");
    await user.type(confirmPasswordInput, "Dipen8035!1");
    await user.click(changePasswordBtn);
    expect(
      await screen.findByText(/New Password doesn't match/i)
    ).toBeInTheDocument();
  });

  it.only("Should toast error if current password is wrong", async () => {
    mockErrorResponse({
      server,
      route: "/user/change-password",
      method: AcceptedMethods.PATCH,
      status: 400,
      msg: "Current password is wrong",
    });
    const {
      confirmPasswordInput,
      currentPasswordInput,
      newPasswordInput,
      changePasswordBtn,
      user,
    } = await renderComponent();
    await user.type(currentPasswordInput, "Vandan8035!@");
    await user.type(newPasswordInput, "Dipen8035!@");
    await user.type(confirmPasswordInput, "Dipen8035!@");
    await user.click(changePasswordBtn);
    expect(
      await screen.findByText(/current password is wrong/i)
    ).toBeInTheDocument();
  });
});

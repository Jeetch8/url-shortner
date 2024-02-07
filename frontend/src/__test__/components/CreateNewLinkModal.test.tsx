import { screen, render, waitFor } from "@testing-library/react";
import CreateNewLinkModal from "@/components/Modal/CreateNewLinkModal";
import { wrapper } from "../Providers";
import { Server } from "miragejs";
import { makeServer } from "../mocks/server";
import * as sidebarContext from "@/context/SidebarContext";
import userEvent from "@testing-library/user-event";
import { mockErrorResponse } from "../utils";
import { AcceptedMethods } from "@/hooks/useFetch";

const sidebarContextMock = vi.spyOn(sidebarContext, "useSidebarContext");

const renderComponent = (isModalOpen: boolean = true) => {
  sidebarContextMock.mockReturnValue({
    isModalOpen: isModalOpen,
    setIsModalOpen: () => {},
    isSidebarOpen: true,
    toggleSidebar: () => {},
  });
  const fields = () => ({
    passwordProtectedCheckbox: screen.getByRole("checkbox", {
      name: /password protected/i,
    }),
    linkCloakingCheckbox: screen.getByRole("checkbox", {
      name: /link cloaking/i,
    }),
    originalUrlInput: screen.getByRole("textbox", {
      name: /original url/i,
    }),
    submitBtn: screen.getByRole("button", { name: /create link/i }),
  });
  return { fields, ...render(<CreateNewLinkModal />, { wrapper }) };
};

describe("Testing CreateNewLinkModal component", () => {
  let server: Server;

  beforeEach(() => {
    server = makeServer({ environment: "test" });
  });

  afterEach(() => {
    vi.resetAllMocks();
    server.shutdown();
  });

  it("Should not render the modal if isModalOpen=false", () => {
    renderComponent(false);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("Should render the modal if isModalOpen=true", () => {
    renderComponent();
    expect(screen.queryByRole("dialog")).toBeInTheDocument();
  });

  it("Should render all main elements", () => {
    const { fields } = renderComponent();
    const {
      passwordProtectedCheckbox,
      linkCloakingCheckbox,
      originalUrlInput,
      submitBtn,
    } = fields();
    expect(originalUrlInput).toBeInTheDocument();
    expect(passwordProtectedCheckbox).toBeInTheDocument();
    expect(passwordProtectedCheckbox).not.toBeChecked();
    expect(linkCloakingCheckbox).toBeInTheDocument();
    expect(linkCloakingCheckbox).not.toBeChecked();
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
  });

  it("Should submit btn be disabled if original_url input field is empty", async () => {
    const { fields } = renderComponent();
    const { submitBtn } = fields();
    expect(submitBtn).toBeDisabled();
  });

  it("Should thow error if original_url input is not a url", async () => {
    const { fields } = renderComponent();
    const { originalUrlInput, submitBtn } = fields();
    const user = userEvent.setup();
    await user.type(originalUrlInput, "testing content");
    await user.click(submitBtn);
    expect(screen.getByText(/provided url is not valid/i)).toBeInTheDocument();
  });

  it("Should not render password field if passwordProtected checkbox is not checked", () => {
    renderComponent();
    const passwordInput = screen.queryByRole("textbox", {
      name: /password/i,
    });
    expect(passwordInput).not.toBeInTheDocument();
  });

  it("Should render password field if passwordProtected checkbox is checked", async () => {
    const { fields } = renderComponent();
    const { passwordProtectedCheckbox } = fields();
    const user = userEvent.setup();
    await user.click(passwordProtectedCheckbox);
    const passwordInput = screen.getByRole("textbox", { name: /password/i });
    expect(passwordInput).toBeInTheDocument();
    await user.click(passwordProtectedCheckbox);
    expect(
      screen.queryByRole("textbox", { name: /password/i })
    ).not.toBeInTheDocument();
  });

  it("Should throw if passwordProtected checked and password field is empty", async () => {
    const { fields } = renderComponent();
    const { passwordProtectedCheckbox, submitBtn } = fields();
    const user = userEvent.setup();
    await user.click(passwordProtectedCheckbox);
    await user.click(submitBtn);
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it("Should throw error if password input does not match the criteria", async () => {
    const { fields } = renderComponent();
    const { passwordProtectedCheckbox, submitBtn } = fields();
    const user = userEvent.setup();
    await user.click(passwordProtectedCheckbox);
    const passwordField = screen.getByRole("textbox", { name: /password/i });
    await user.type(passwordField, "12345678");
    await user.click(submitBtn);
    expect(screen.getByText(/password must be atleast/i)).toBeInTheDocument();
  });

  it("Should throw an error if password length is greater than 10", async () => {
    const { fields } = renderComponent();
    const { passwordProtectedCheckbox, submitBtn } = fields();
    const user = userEvent.setup();
    await user.click(passwordProtectedCheckbox);
    const passwordField = screen.getByRole("textbox", { name: /password/i });
    await user.type(passwordField, "12345678910");
    await user.click(submitBtn);
    expect(
      screen.getByText(/password should be less than 10/i)
    ).toBeInTheDocument();
  });

  it("Should display any errors if thrown from server", async () => {
    mockErrorResponse({
      server,
      status: 500,
      msg: "Internal Server Error",
      method: AcceptedMethods.POST,
      route: "/url",
    });
    const { fields } = renderComponent();
    const {
      passwordProtectedCheckbox,
      submitBtn,
      originalUrlInput,
      linkCloakingCheckbox,
    } = fields();
    const user = userEvent.setup();
    await user.type(originalUrlInput, "http://www.example.com");
    await user.click(passwordProtectedCheckbox);
    const passwordField = screen.getByRole("textbox", { name: /password/i });
    await user.type(passwordField, "JEetk8035");
    await user.click(linkCloakingCheckbox);
    await user.click(submitBtn);
    await waitFor(() => {
      const toast = screen.getByRole("status");
      expect(toast).toBeInTheDocument();
      expect(toast).toHaveTextContent(/internal server error/i);
    });
  });

  it("Should change button text to loader", async () => {
    const { fields } = renderComponent();
    const {
      passwordProtectedCheckbox,
      submitBtn,
      originalUrlInput,
      linkCloakingCheckbox,
    } = fields();
    const user = userEvent.setup();
    await user.type(originalUrlInput, "http://www.example.com");
    await user.click(passwordProtectedCheckbox);
    const passwordField = screen.getByRole("textbox", { name: /password/i });
    await user.type(passwordField, "JEetk8035");
    await user.click(linkCloakingCheckbox);
    await user.click(submitBtn);
    await waitFor(() => {
      expect(screen.getByRole("loader")).toBeInTheDocument();
    });
  });
});

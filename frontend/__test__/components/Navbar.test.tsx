import { screen, render, waitFor } from "@testing-library/react";
import Navbar from "@/components/Global/Navbar";
import { wrapper } from "../Providers";
import userEvent from "@testing-library/user-event";
import { Server } from "miragejs";
import { makeServer } from "../mocks/server";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Testing Navbar component", () => {
  let server: Server;

  beforeEach(() => {
    server = makeServer({ environment: "test" });
  });

  afterEach(() => {
    server.shutdown();
    vi.restoreAllMocks();
  });

  const renderComponent = () => {
    const user = userEvent.setup();
    return {
      user,
      ...render(<Navbar />, { wrapper }),
    };
  };

  it("Should render main elements", async () => {
    const { user } = renderComponent();
    const dropDownBtn = screen.getByRole("dropdown_toggle");
    await user.click(dropDownBtn);
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").length).toBe(2);
    expect(screen.getByText(/settings/i)).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
    await user.click(dropDownBtn);
  });

  it("Should navigate to settings on click", async () => {
    const { user } = renderComponent();
    const dropDownBtn = screen.getByRole("dropdown_toggle");
    await user.click(dropDownBtn);
    const settingsOption = screen.getByText(/settings/i);
    expect(settingsOption).toBeInTheDocument();
    await user.click(settingsOption);
    expect(mockNavigate).toHaveBeenCalledOnce();
    expect(mockNavigate).toHaveBeenCalledWith("/settings");
  });
});

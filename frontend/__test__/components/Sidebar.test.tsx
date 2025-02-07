import { screen, render } from "@testing-library/react";
import Sidebar from "@/components/Global/Sidebar";
import { wrapper } from "../Providers";
import { Server } from "miragejs";
import { makeServer } from "../mocks/server";
import userEvent from "@testing-library/user-event";

const mockNavigate = vi.fn();
const mockUseLocationPathname = vi.fn().mockResolvedValue({ pathname: "/" });
vi.spyOn(Storage.prototype, "getItem").mockResolvedValue("token");
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockUseLocationPathname,
  };
});

const mockLocalStorageClear = vi.spyOn(Storage.prototype, "clear");

const navList = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Links",
    path: "/links",
  },
  {
    name: "Settings",
    path: "/settings",
  },
  {
    name: "Billing & Usuage",
    path: "/billing-and-usuage",
  },
];

describe("Testing Sidebar component", () => {
  let server: Server;

  beforeEach(() => {
    server = makeServer({ environment: "test" });
  });

  afterEach(() => {
    vi.resetAllMocks();
    server.shutdown();
  });

  const renderComponent = () => {
    return {
      ...render(<Sidebar />, { wrapper }),
    };
  };

  it("Should render all elements", () => {
    renderComponent();
    const headingLogo = screen.getByRole("heading");
    expect(headingLogo).toHaveTextContent(/short/i);
    const createNewLinkBtn = screen.getByRole("button", {
      name: /create new link/i,
    });
    expect(createNewLinkBtn).toBeInTheDocument();
    navList.forEach((el) => {
      screen.getByRole("listitem", { name: RegExp("nav_btn_" + el.name, "i") });
    });
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });

  it.each(navList)(
    "Should navigate to $path onClick $name nav btn",
    async ({ name, path }) => {
      renderComponent();
      const navBtn = screen.getByRole("listitem", {
        name: RegExp("nav_btn_" + name, "i"),
      });
      const user = userEvent.setup();
      await user.click(navBtn);
      expect(mockNavigate).toHaveBeenCalledOnce();
      expect(mockNavigate).toBeCalledWith(path);
    }
  );

  it("Should clear localstorage and navigate to login on logout click", async () => {
    renderComponent();
    const logoutBtn = screen.getByText(/logout/i);
    const user = userEvent.setup();
    await user.click(logoutBtn);
    expect(mockLocalStorageClear).toHaveBeenCalled();
    expect(mockNavigate).toBeCalledWith("/login");
  });
});

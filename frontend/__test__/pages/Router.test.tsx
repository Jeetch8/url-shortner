import { render, screen, waitFor } from "@testing-library/react";
import { routes } from "../../utils/routes";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { PropsWithChildren } from "react";
import { MockInstance } from "vitest";
import { Server } from "miragejs";
import { makeServer } from "../mocks/server";
import { debug } from "vitest-preview";

const userContext = vi.mock("../src/context/UserContext", async () => {
  const actual = await vi.importActual("../src/context/UserContext");
  return {
    ...actual,
    UserContextProvider: ({ children }: PropsWithChildren) => (
      <div>{children}</div>
    ),
    useUserContext: () => ({
      user: { user: { name: "John Doe", subscription_id: "asdasdsa" } },
    }),
  };
});

// const mockNavigate = vi.fn();
// vi.mock("react-router-dom", async () => {
//   const actual = await vi.importActual("react-router-dom");
//   return {
//     ...actual,
//     useNavigate: () => mockNavigate,
//   };
// });

// vi.mock("../src/context/UserContext", {
//   UserContextProvider: ({ children }: PropsWithChildren) => (
//     <div>{children}</div>
//   ),
//   useUserContext: () => ({ user: { user: { name: "John Doe" } } }),
// });

describe("Testing router", () => {
  let localStorageClearMock: MockInstance;
  let localStorageGetMock: MockInstance;
  beforeAll(() => {
    localStorageClearMock = vi.spyOn(Storage.prototype, "clear");
    localStorageGetMock = vi
      .spyOn(Storage.prototype, "getItem")
      .mockResolvedValue("token");
  });

  let server: Server;

  beforeEach(() => {
    vi.clearAllMocks();
    server = makeServer({ environment: "test" });
  });

  afterEach(() => {
    server.shutdown();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it.each([
    {
      title: "home",
      path: "/",
      toDetect: () => screen.getByRole("heading", { name: /hello/i }),
    },
    {
      title: "links",
      path: "/links",
      toDetect: () => screen.getByRole("heading", { name: /links/i }),
    },
    {
      title: "link stats",
      path: "/links/1",
      toDetect: () => screen.getByText(/localhost:8000/i),
    },
    {
      title: "link edit",
      path: "/links/1/edit",
      toDetect: () => screen.getByRole("heading", { name: /edit link/i }),
    },
    // {
    //   title: "settings",
    //   path: "/settings",
    //   toDetect: () => screen.getByRole("heading", { name: /profile/i }),
    // },
    {
      title: "billing and usuage",
      path: "/billing-and-usuage",
      toDetect: () =>
        screen.getByRole("heading", { name: /billing and usuage/i }),
    },
    {
      title: "subscribe",
      path: "/subscribe",
      toDetect: () => screen.getByRole("button", { name: /subscribe/i }),
    },
    {
      title: "login",
      path: "/login",
      toDetect: () => screen.getByRole("heading", { name: /login/i }),
    },
    {
      title: "register",
      path: "/register",
      toDetect: () => screen.getByRole("heading", { name: /register/i }),
    },
  ])("Should render the $title page", async ({ title, path, toDetect }) => {
    if (title === "register" || title === "login")
      localStorageGetMock.mockReturnValue(undefined);
    const router = createMemoryRouter(routes, { initialEntries: [path] });

    render(<RouterProvider router={router} />);
    await waitFor(() => {
      expect(toDetect()).toBeInTheDocument();
    });
  });
});

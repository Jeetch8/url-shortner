import { screen, render, waitFor } from "@testing-library/react";
import LinkStatsDashboard from "@/pages/LinkStatsDashboard";
import { wrapper } from "../Providers";
import { makeServer } from "../mocks/server";
import { Server } from "miragejs";
import { mockRequestResponse } from "../utils";
import { AcceptedMethods } from "@/hooks/useFetch";
import { ShortendUrlDocument } from "@shared/types/mongoose-types";
import { url_retrival_base_url } from "@/utils/base_url";
import { ILogs, IStats } from "@shared/types/controllers/dashboard.type";

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

vi.mock("@/components/Charts/BarChart", () => ({
  default: vi.fn(() => <div data-testid="bar-chart" />),
}));

vi.mock("@/components/Charts/HorizontalBarChart", () => ({
  default: vi.fn(() => <div data-testid="horizontal-bar-chart" />),
}));

vi.mock("@/components/Maps/WorldMap", () => ({
  default: vi.fn(() => <div data-testid="world-map" />),
}));

vi.mock("@/components/Tables/ClicksLogTable", () => ({
  default: vi.fn(() => <div data-testid="clicks-log-table" />),
}));

function renderComponent() {
  const rendered = render(<LinkStatsDashboard />, { wrapper: wrapper });
  return {
    ...rendered,
  };
}

const mockDasboardStatsResponse = (server: Server) => {
  const shortendUrl = server.create("shortendUrl").attrs as ShortendUrlDocument;
  const logsAndStast = server.create("linkStat").attrs as {
    logs: ILogs[];
    stats: IStats;
  };
  const data = {
    status: "success",
    data: { ...logsAndStast, shortend_url: shortendUrl },
  };
  mockRequestResponse({
    server,
    route: "/dashboard/link/test1",
    method: AcceptedMethods.GET,
    data,
  });
  return { data };
};

describe("Testing LinkStatsDashboard page", () => {
  let server: Server;

  beforeEach(() => {
    server = makeServer({ environment: "test" });
  });

  afterEach(() => {
    server.shutdown();
  });

  it("should render all elements if stats are available", async () => {
    const { data } = mockDasboardStatsResponse(server);
    const {} = renderComponent();
    await waitFor(() => {
      const faviconImg = screen.getByRole("avatar");
      expect(
        faviconImg.style.backgroundImage.startsWith(
          "url(https://www.google.com/s2/favicons?domain"
        )
      ).toBe(true);
      const shortnedUrltitle = screen.getByRole("link", {
        name: `${url_retrival_base_url}/${data.data.shortend_url.shortend_url_cuid}`,
      });
      expect(shortnedUrltitle).toBeInTheDocument();
      const originalUrlTitle = screen.getByRole("link", {
        name: data.data.shortend_url.original_url,
      });
      expect(originalUrlTitle).toBeInTheDocument();

      expect(screen.getAllByTestId("bar-chart").length).toBeGreaterThan(0);
      expect(
        screen.getAllByTestId("horizontal-bar-chart").length
      ).toBeGreaterThan(0);
      expect(screen.getByTestId("world-map")).toBeInTheDocument();
      expect(screen.getByTestId("clicks-log-table")).toBeInTheDocument();
    });
  });

  it("Should render error message if stats are not available", async () => {
    mockRequestResponse({
      server,
      route: "/dashboard/link/test1",
      method: AcceptedMethods.GET,
      status: 404,
      data: { status: "error", message: "Shortend link not found" },
    });
    renderComponent();
    await waitFor(() => {
      expect(mockNavigate).toBeCalledWith("/404");
    });
  });
});

import { screen, render } from "@testing-library/react";
import Home from "@/pages/Home";
import { wrapper } from "../Providers";
import { mockRequestResponse } from "../utils";
import { Server } from "miragejs";
import { AcceptedMethods } from "@/hooks/useFetch";
import { makeServer } from "../mocks/server";

const renderComponent = (server: Server) => {
  const stats = server.create("linkStat").attrs;
  const shortend_url = server.create("shortendUrl").attrs;
  const data = { data: { ...stats, shortend_url } };
  mockRequestResponse({
    server,
    route: "/dashboard/link/1",
    method: AcceptedMethods.GET,
    data,
  });
  return {
    ...render(<Home />, { wrapper }),
    totalClicksCard: screen.getByRole("heading", { name: /Total Clicks/i }),
    totalLinkGeneratedCard: screen.getByRole("heading", {
      name: /total Links Generated/i,
    }),
  };
};

vi.mock("@/components/Charts/LineChart", () => ({
  default: vi.fn(() => <div data-testid="line-chart" />),
}));

vi.mock("@/components/Maps/WorldMap", () => ({
  default: vi.fn(() => <div data-testid="world-map" />),
}));

vi.mock("@/components/Tables/ReferrerTable", () => ({
  default: vi.fn(() => <div data-testid="referrer-table" />),
}));

vi.mock("@/components/Tables/DevicesTable", () => ({
  default: vi.fn(() => <div data-testid="devices-table" />),
}));

describe("Testing Home page", () => {
  let server: Server;

  beforeEach(() => {
    server = makeServer({ environment: "test" });
  });

  afterEach(() => {
    server.shutdown();
  });

  it("Should render main elements", () => {
    renderComponent(server);
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    expect(screen.getByTestId("world-map")).toBeInTheDocument();
    expect(screen.getByTestId("referrer-table")).toBeInTheDocument();
    expect(screen.getByTestId("devices-table")).toBeInTheDocument();
  });
});

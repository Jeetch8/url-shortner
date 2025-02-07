import { screen, render, waitFor } from "@testing-library/react";
import GeneratedLinkList from "@/components/Links/GeneratedLinkList";
import { wrapper } from "../Providers";
import { Server } from "miragejs";
import { makeServer } from "../mocks/server";
import { mockErrorResponse, mockRequestResponse } from "../utils";
import { AcceptedMethods } from "@/hooks/useFetch";

describe("Testing GeneratedLinkList component", () => {
  const renderComponent = () => {
    render(<GeneratedLinkList />, { wrapper });
  };

  let server: Server;

  beforeEach(() => {
    server = makeServer({ environment: "test" });
  });

  afterEach(() => {
    server.shutdown();
  });

  it("Should render loader initially", async () => {
    renderComponent();
    expect(screen.getByRole("loader")).toBeInTheDocument();
  });

  it("Should render error when fetch error received", async () => {
    const errMsg = "Testing err";
    mockErrorResponse({
      server,
      route: "/url/",
      method: AcceptedMethods.GET,
      msg: errMsg,
    });
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(errMsg)).toBeInTheDocument();
    });
  });

  it("Should render all link cards", async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByRole("list")).toBeInTheDocument();
      expect(screen.getAllByRole("listitem").length).toBe(5);
    });
  });

  it("Should render msg if resp array is empty", async () => {
    mockRequestResponse({
      server,
      route: "/url/",
      method: AcceptedMethods.GET,
      data: { data: { generated_links: [] } },
    });
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/No Links to show here/i)).toBeInTheDocument();
    });
  });
});

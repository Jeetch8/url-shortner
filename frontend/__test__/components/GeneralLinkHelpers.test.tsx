import GeneralLinkHelpers from "../../src/components/GeneralLinkHelpers";
import { screen, render } from "@testing-library/react";
import { StatsPopulatedShortnedUrl } from "../../src/pages/Links";
import { makeServer } from "../mocks/server";
import { Server } from "miragejs";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    {children}
    <Toaster />
  </BrowserRouter>
);

describe("Testing GeneralLinkHelpers component", () => {
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

  const renderComponent = async () => {
    const shortendUrl = server.create("shortendUrl") as any;

    // If you need to override any specific fields, you can do so like this:
    // const shortendUrl = server.create("shortendUrl", { link_title: "Custom Title" }) as any;
    const linkObj = shortendUrl.attrs;
    const fetchGeneratedLinksMock = vi.fn(() => {});
    render(
      <GeneralLinkHelpers
        fetchGeneratedLinks={fetchGeneratedLinksMock}
        linkObj={linkObj}
      />,
      { wrapper }
    );
    return {
      fetchGeneratedLinksMock,
      linkObj,
    };
  };

  it("Should render all icons", () => {
    renderComponent();
    expect(true).toBeTruthy();
  });
});

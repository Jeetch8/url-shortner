import { screen, render } from "@testing-library/react";
import LinkCard from "@/components/Links/LinkCard";
import { StatsPopulatedShortnedUrl } from "@/pages/Links";
import { Server } from "miragejs";
import { makeServer } from "../mocks/server";
import { wrapper } from "../Providers";
import { url_retrival_base_url } from "@/utils/base_url";

describe("Testing LinkCard component", () => {
  let server: Server;

  beforeEach(() => {
    server = makeServer({ environment: "test" });
  });

  afterEach(() => {
    server.shutdown();
  });

  const renderComponent = (links?: Partial<StatsPopulatedShortnedUrl>) => {
    const shortendUrl = server.create("shortendUrl") as any;
    const linkObj: StatsPopulatedShortnedUrl = {
      ...shortendUrl.attrs,
      ...links,
      favorite: true,
    };
    return {
      ...render(<LinkCard el={linkObj} fetchGeneratedLinks={() => {}} />, {
        wrapper,
      }),
      linkObj,
    };
  };

  it("Should render all elements", () => {
    const { linkObj } = renderComponent();
    expect(screen.getByRole("avatar")).toBeInTheDocument();

    const shortendUrlTitle = screen.getByRole("link", {
      name: linkObj.link_title,
    });
    expect(shortendUrlTitle).toBeInTheDocument();
    expect(shortendUrlTitle).toHaveAttribute(
      "href",
      `/links/${linkObj.shortend_url_cuid}`
    );

    const shortendUrlLink = screen.getByRole("link", {
      name: url_retrival_base_url + "/" + linkObj.shortend_url_cuid,
    });
    expect(shortendUrlLink).toBeInTheDocument();
    expect(shortendUrlLink).toHaveAttribute(
      "href",
      url_retrival_base_url + "/" + linkObj.shortend_url_cuid
    );
  });

  it("Should render dots if original url is longer than 50 characters", () => {
    const { linkObj } = renderComponent({
      original_url: "https://www.google.com".repeat(10),
    });
    const shortendUrlLink = screen.getByRole("link", {
      name: linkObj.original_url.substring(0, 50) + "...",
    });
    expect(shortendUrlLink).toBeInTheDocument();
    expect(shortendUrlLink).toHaveAttribute("href", linkObj.original_url);
  });

  it("Should not render dots if original url is shorter than 50 characters", () => {
    const { linkObj } = renderComponent({
      original_url: "https://www.google.com",
    });
    const shortendUrlLink = screen.getByRole("link", {
      name: linkObj.original_url,
    });
    expect(shortendUrlLink).toBeInTheDocument();
    expect(shortendUrlLink).toHaveAttribute("href", linkObj.original_url);
  });

  it("Should render date", () => {
    const { linkObj } = renderComponent();
    const date = screen.getByText(
      new Date(linkObj.createdAt?.toString() as string).toDateString()
    );
    expect(date).toBeInTheDocument();
  });

  it("Should render 'clicks' text if greater than 1", () => {
    const { linkObj } = renderComponent({
      stats: { total_clicks: 2, shortend_url_id: "asdasd" },
    });
    const totalClicks = screen.getByText(`2 Clicks`);
    expect(totalClicks).toBeInTheDocument();
  });

  it("Should render 'click' text if less than 2", () => {
    const { linkObj } = renderComponent({
      stats: { total_clicks: 1, shortend_url_id: "asdasd" },
    });
    const totalClicks = screen.getByText(`1 Click`);
    expect(totalClicks).toBeInTheDocument();
  });
});

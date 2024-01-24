import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Server } from "miragejs";
import GeneralLinkHelpers from "../../src/components/GeneralLinkHelpers";
import { makeServer } from "../mocks/server";
import { wrapper } from "../Providers";
import { StatsPopulatedShortnedUrl } from "../../src/pages/Links";
import { userEvent } from "@testing-library/user-event";
import { mockRequestResponse } from "../utils";
import { AcceptedMethods } from "../../src/hooks/useFetch";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("GeneralLinkHelpers", () => {
  let server: Server;

  beforeEach(() => {
    server = makeServer({ environment: "test" });
  });

  afterEach(() => {
    server.shutdown();
  });

  const renderComponent = (props?: { favorite?: boolean }) => {
    const shortendUrl = server.create("shortendUrl") as any;
    const linkObj: StatsPopulatedShortnedUrl = {
      ...shortendUrl.attrs,
      favorite: props?.favorite ?? false,
    };
    const user = userEvent.setup();
    render(
      <GeneralLinkHelpers
        linkObj={linkObj}
        fetchGeneratedLinks={mockFetchGeneratedLinks}
      />,
      { wrapper }
    );
    return { user };
  };

  const mockFetchGeneratedLinks = vi.fn();

  it("renders all action buttons", () => {
    renderComponent();

    expect(screen.getByLabelText("btn_Favorite")).toBeInTheDocument();
    expect(screen.getByLabelText("btn_Visit Url")).toBeInTheDocument();
    expect(screen.getByLabelText("btn_Copy")).toBeInTheDocument();
    expect(screen.getByLabelText("btn_Share")).toBeInTheDocument();
    expect(screen.getByLabelText("btn_Edit")).toBeInTheDocument();
    expect(screen.getByLabelText("btn_Trash")).toBeInTheDocument();
  });

  it("toggles favorite status", async () => {
    const fetchSpy = vi.spyOn(global, "fetch");
    mockRequestResponse({
      server,
      route: "/user/favorite",
      method: AcceptedMethods.PATCH,
      data: { favorite: true },
    });

    const { user } = renderComponent({ favorite: true });

    const favoriteButton = screen.getByLabelText("btn_Favorite");
    await user.click(favoriteButton);

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalled();
      expect(favoriteButton.querySelector("svg")).toHaveClass(
        "fill-yellow-500"
      );
    });
  });

  it.only("opens share modal", async () => {
    const { user } = renderComponent();

    const shareButton = screen.getByLabelText("btn_Share");
    await user.click(shareButton);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("copies link to clipboard", async () => {
    const mockCopyToClipboard = vi.fn();
    vi.mock("../hooks/useCopyToClipboard", () => ({
      default: () => ({
        copyToClipboard: mockCopyToClipboard,
      }),
    }));

    const { user } = renderComponent();

    const copyButton = screen.getByLabelText("btn_Copy");
    await user.click(copyButton);

    expect(mockCopyToClipboard).toHaveBeenCalledWith(
      "http://localhost:3000/abc123"
    );
  });

  it("deletes link", async () => {
    server.delete("/url/123", () => {
      return { success: true };
    });

    const { user } = renderComponent();

    const deleteButton = screen.getByLabelText("btn_Trash");
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockFetchGeneratedLinks).toHaveBeenCalled();
    });
  });

  it("navigates to edit page", async () => {
    const { user } = renderComponent();

    const editButton = screen.getByLabelText("btn_Edit");
    await user.click(editButton);

    expect(mockNavigate).toHaveBeenCalledWith("/links/123/edit");
  });
});

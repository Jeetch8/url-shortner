import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Server } from "miragejs";
import GeneralLinkHelpers from "@/components/GeneralLinkHelpers";
import { makeServer } from "../mocks/server";
import { wrapper } from "../Providers";
import { StatsPopulatedShortnedUrl } from "@/pages/Links";
import { userEvent } from "@testing-library/user-event";
import { mockRequestResponse } from "../utils";
import { AcceptedMethods } from "@/hooks/useFetch";

vi.spyOn(Storage.prototype, "getItem").mockResolvedValue("token");

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
    vi.restoreAllMocks();
  });

  const renderComponent = (
    props?: Partial<StatsPopulatedShortnedUrl> & { favorite: boolean }
  ) => {
    const shortendUrl = server.create("shortendUrl") as any;
    const linkObj: StatsPopulatedShortnedUrl = {
      ...shortendUrl.attrs,
      ...props,
      // favorite: props?.favorite ?? false,
    };
    const user = userEvent.setup();
    return {
      user,
      ...render(
        <GeneralLinkHelpers
          linkObj={linkObj}
          fetchGeneratedLinks={mockFetchGeneratedLinks}
        />,
        { wrapper }
      ),
      linkObj,
    };
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
      data: { data: { favorite: true } },
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

  it("opens share modal", async () => {
    const { user } = renderComponent();

    const shareButton = screen.getByLabelText("btn_Share");
    await user.click(shareButton);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("deletes link", async () => {
    mockRequestResponse({
      server,
      route: "/url/123",
      method: AcceptedMethods.DELETE,
      data: { data: { success: true } },
    });

    const { user } = renderComponent({ _id: "123" });
    const deleteButton = screen.getByLabelText("btn_Trash");
    await user.click(deleteButton);

    const toaster = await screen.findByRole("status");
    expect(toaster).toBeInTheDocument();
    expect(toaster).toHaveTextContent(/Link deleted/i);
    // });
  });

  it("navigates to edit page", async () => {
    const { user, linkObj } = renderComponent();

    const editButton = screen.getByLabelText("btn_Edit");
    await user.click(editButton);

    expect(mockNavigate).toHaveBeenCalledWith(`/links/${linkObj._id}/edit`);
  });

  it("copies link to clipboard", async () => {
    const { user } = renderComponent();
    const writeTextMockFn = vi.fn((value) => Promise.resolve(value));
    Object.defineProperty(global.navigator, "clipboard", {
      value: {
        writeText: writeTextMockFn,
      },
      configurable: true,
    });
    const copyButton = screen.getByLabelText("btn_Copy");
    await user.click(copyButton);

    await waitFor(() => {
      expect(writeTextMockFn).toHaveBeenCalledOnce();
      // .toHaveBeenCalledWith(
      //   "http://localhost:3000/abc123"
      // );
    });
  });
});

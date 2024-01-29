import { screen, render, waitFor } from "@testing-library/react";
import LinkShareModal from "@/components/Modal/LinkShareModal";
import { StatsPopulatedShortnedUrl } from "@/pages/Links";
import { Server } from "miragejs";
import { makeServer } from "../mocks/server";
import userEvent from "@testing-library/user-event";
import { url_retrival_base_url } from "@/utils/base_url";

// vi.useFakeTimers();

describe("Testing LinkShareModal Component", () => {
  let server: Server;
  beforeEach(() => {
    server = makeServer({ environment: "test" });
  });

  afterEach(() => {
    server.shutdown();
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  const renderComponent = (props?: { isModalOpen?: boolean }) => {
    const user = userEvent.setup();
    const shortendUrl = server.create("shortendUrl") as any;
    const linkObj: StatsPopulatedShortnedUrl = {
      ...shortendUrl.attrs,
      favorite: true,
    };
    const setIsModalOpenMock = vi.fn();
    render(
      <LinkShareModal
        isModalOpen={props?.isModalOpen ?? true}
        setIsModalOpen={setIsModalOpenMock}
        linkInfo={linkObj}
      />
    );
    return {
      user,
      linkObj,
    };
  };

  it("renders LinkShareModal component", () => {
    const { linkObj } = renderComponent();
    const allButtons = screen.getAllByRole("button");
    const sharingBtns = allButtons.length - 1;
    expect(sharingBtns).toBe(5);
    const linkTitle = screen.getByRole("heading", { name: linkObj.link_title });
    expect(linkTitle).toBeInTheDocument();
    const avatar = screen.getByRole("avatar");
    expect(avatar).toBeInTheDocument();
    const original_url = screen.getByRole("link", {
      name: linkObj.original_url,
    });
    expect(original_url).toBeInTheDocument();
    expect(screen.getByLabelText("btn_Copy")).toBeInTheDocument();
    expect(screen.getByLabelText("btn_Facebook")).toBeInTheDocument();
    expect(screen.getByLabelText("btn_Mail")).toBeInTheDocument();
    expect(screen.getByLabelText("btn_Linkedin")).toBeInTheDocument();
  });

  it.skip("Should copy the link to clipboard", async () => {
    const writeTextMockFn = vi.fn((value) => Promise.resolve(value));
    Object.defineProperty(global.navigator, "clipboard", {
      value: {
        writeText: writeTextMockFn,
      },
      configurable: true,
    });

    const { user, linkObj } = renderComponent();
    const copyLinkBtn = screen.getByRole("button", { name: "btn_Copy" });
    await user.click(copyLinkBtn);
    await waitFor(() => {
      expect(writeTextMockFn).toHaveBeenCalledOnce();
      expect(writeTextMockFn).toHaveBeenCalledWith(
        `${url_retrival_base_url}/${linkObj.shortend_url_cuid}`
      );
      expect(copyLinkBtn).toHaveTextContent(/copied/i);
    });
  });
});

import { screen, render, waitFor } from "@testing-library/react";
import Modal from "../../components/Modal/Modal";
import userEvent from "@testing-library/user-event";
import React, { ReactElement } from "react";

describe("Testing Modal component", () => {
  const renderComponent = (props?: {
    isModalOpen?: boolean;
    children?: ReactElement;
  }) => {
    const setIsModalOpenMock = vi.fn();
    const user = userEvent.setup();
    return {
      user,
      setIsModalOpenMock,
      ...render(
        <Modal
          isModalOpen={props?.isModalOpen ?? true}
          setIsModalOpen={setIsModalOpenMock}
        >
          {props?.children}
        </Modal>
      ),
    };
  };

  it("Should not render modal if isModalOpen is false", () => {
    renderComponent({ isModalOpen: false });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("Should render modal if isModalOpen is true", () => {
    renderComponent();
    expect(screen.queryByRole("dialog")).toBeInTheDocument();
  });

  it("Should render main components of modal", () => {
    const children = (
      <div>
        <h1>Testing heading</h1>
      </div>
    );
    renderComponent({ children });
    expect(screen.queryByRole("dialog")).toBeInTheDocument();
    const closeBtn = screen.queryByRole("button", { name: "btn_close" });
    const blackScreen = screen.queryByRole("black_screen");
    expect(screen.getByRole("heading", { name: "Testing heading" }));
    expect(blackScreen).toBeInTheDocument();
    expect(closeBtn).toBeInTheDocument();
  });

  it("Should stop scrolling if isModalOpen true", async () => {
    renderComponent({ isModalOpen: true });
    expect(document.body.classList.contains("stop-scrolling")).toBe(true);
  });

  it("Should restore scrolling if isModalOpen false", async () => {
    let isModalOpen = true;
    const { user, rerender } = renderComponent({ isModalOpen });
    const closeBtn = screen.getByRole("button", { name: "btn_close" });
    await user.click(closeBtn);
    rerender(<Modal isModalOpen={false} setIsModalOpen={() => {}}></Modal>);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(document.body.classList.contains("stop-scrolling")).toBe(false);
    });
  });

  it("Should close modal if clicked outside", async () => {
    const { user, rerender } = renderComponent();
    expect(screen.queryByRole("dialog")).toBeInTheDocument();
    const blackScreen = screen.getByRole("black_screen");
    await user.click(blackScreen);
    rerender(<Modal isModalOpen={false} setIsModalOpen={() => {}}></Modal>);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.body.classList.contains("stop-scrolling")).toBe(false);
    expect(screen.queryByRole("black_screen")).not.toBeInTheDocument();
  });
});

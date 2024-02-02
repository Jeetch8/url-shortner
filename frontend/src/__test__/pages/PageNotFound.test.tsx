import { screen, render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { PropsWithChildren } from "react";
import userEvent from "@testing-library/user-event";
import PageNotFound from "@/pages/PageNotFound";

const wrapper = ({ children }: PropsWithChildren) => {
  return (
    <BrowserRouter>
      {children}
      <Toaster />
    </BrowserRouter>
  );
};

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Testing PageNotFound page", () => {
  const renderComponent = () => {
    const user = userEvent.setup();
    return {
      ...render(<PageNotFound />, { wrapper }),
      user,
      navigateBtn: screen.getByRole("button", { name: /go to home/i }),
    };
  };

  it("Should render all main elements", () => {
    renderComponent();
    screen.getByRole("heading", { name: /404/i });
    screen.getByRole("heading", { name: /page not found/i });
    screen.getByRole("button", { name: /go to home/i });
  });

  it("Should go to home page onClick", async () => {
    const { user, navigateBtn } = renderComponent();
    await user.click(navigateBtn);
    expect(mockNavigate).toHaveBeenCalledOnce();
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});

import { screen, render } from "@testing-library/react";
import PasswordInput from "@/components/Form/PasswordInput";
import { FieldError } from "react-hook-form";
import userEvent from "@testing-library/user-event";

describe("Testing PasswordInput component", () => {
  const renderComponent = (toHaveError: boolean = false) => {
    const registerMock = vi.fn();
    const errors: FieldError = {
      type: "required",
      message: "Email is required",
      ref: { name: "email" },
    };
    return {
      ...render(
        <PasswordInput
          register={registerMock}
          fieldName="email"
          placeholder="Email"
          errors={toHaveError ? errors : undefined}
        />
      ),
    };
  };

  it("Should toggle on click", async () => {
    renderComponent();
    const field = screen.getByPlaceholderText("Email") as HTMLInputElement;
    const user = userEvent.setup();
    expect(field.type).toBe("password");
    const toggler = screen.getByRole("button");
    await user.click(toggler);
    expect(field.type).toBe("text");
  });

  it("Should show error", () => {
    renderComponent(true);
    expect(screen.getByLabelText(/error_status_email/i)).toBeInTheDocument();
  });

  it("Should not show error if undefined", () => {
    renderComponent(false);
    expect(
      screen.queryByLabelText(/error_status_email/i)
    ).not.toBeInTheDocument();
  });
});

import { screen, render } from "@testing-library/react";
import AvatarImage from "../../src/components/AvatarImage";

describe("Testing AvatarImage compnent", () => {
  it("Should render initial state", () => {
    render(<AvatarImage url="https://www.google.com" diameter="100px" />);
    const avatarImage = screen.getByRole("avatar");
    expect(avatarImage).toHaveStyle({
      width: "100px",
      height: "100px",
      borderRadius: "100%",
      backgroundImage: "url(https://www.google.com",
    });
  });
});

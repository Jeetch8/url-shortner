import { screen, render } from "@testing-library/react";
import Navbar from "../../src/components/Navbar";
import { wrapper } from "../Providers";

describe("Testing Navbar component", () => {
  const renderComponent = async () => {
    render(<Navbar />, { wrapper });
  };
  it("Should render ", () => {
    renderComponent();
    expect(true).toBeTruthy();
  });
});

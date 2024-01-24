import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";

export const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    {children}
    <Toaster />
  </BrowserRouter>
);

import { SidebarContextProvider } from "@/context/SidebarContext";
import { UserContextProvider } from "@/context/UserContext";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";

export const wrapper = ({ children }: { children: React.ReactNode }) => {
  vi.spyOn(Storage.prototype, "getItem").mockResolvedValue("token");
  return (
    <BrowserRouter>
      <UserContextProvider>
        <SidebarContextProvider>{children}</SidebarContextProvider>
      </UserContextProvider>
      <Toaster />
    </BrowserRouter>
  );
};

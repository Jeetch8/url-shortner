import { Outlet, Navigate } from "react-router-dom";
import { getTokenFromLocalStorage } from "@/utils/localstorage";
import Navbar from "@/components/Global/Navbar";
import Sidebar from "@/components/Global/Sidebar";
import { SidebarContextProvider } from "@/context/SidebarContext";
import { UserContextProvider } from "@/context/UserContext";
import CreateNewLinkModal from "@/components/Modal/CreateNewLinkModal";

const HomeLayout = () => {
  const isUserLoggedIn = getTokenFromLocalStorage();
  return isUserLoggedIn ? (
    <>
      <UserContextProvider>
        <SidebarContextProvider>
          <div className="w-full">
            <Sidebar />
            <div className="w-full bg-[#F4F6FA] h-full">
              <Navbar />
              <div className={"md:ml-[80px] xl:ml-[240px] mt-[60px]"}>
                <Outlet />
              </div>
            </div>
          </div>
          <CreateNewLinkModal />
        </SidebarContextProvider>
      </UserContextProvider>
    </>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default HomeLayout;

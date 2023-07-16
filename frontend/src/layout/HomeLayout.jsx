import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { getTokenFromLocalStorage } from "../utils/localstorage";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { SidebarContextProvider } from "../context/SidebarContext";
import { UserContextProvider } from "../context/UserContext";

const HomeLayout = () => {
  const isUserLoggedIn = getTokenFromLocalStorage();

  return isUserLoggedIn ? (
    <>
      <UserContextProvider>
        <SidebarContextProvider>
          <div className="flex w-full">
            <Sidebar />
            <div className="w-full bg-[#F4F6FA]">
              <Navbar />
              <Outlet />
            </div>
          </div>
        </SidebarContextProvider>
      </UserContextProvider>
    </>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default HomeLayout;

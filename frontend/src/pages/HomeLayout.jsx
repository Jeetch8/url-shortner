import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { getUserFromLocalStorage } from "../utils/localstorage";
import Navbar from "../components/Navbar";

const HomeLayout = () => {
  const isUserLoggedIn = getUserFromLocalStorage();
  // const location = useLocation();

  return isUserLoggedIn ? (
    <>
      <Navbar /> <Outlet />
    </>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default HomeLayout;

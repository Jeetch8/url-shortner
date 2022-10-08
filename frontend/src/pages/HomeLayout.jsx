import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { getUserFromLocalStorage } from "../utils/localstorage";
import Login from "./Login";

const HomeLayout = () => {
  const isUserLoggedIn = getUserFromLocalStorage();
  const location = useLocation();

  return isUserLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default HomeLayout;

import React from "react";
import {
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomeLayout from "./pages/HomeLayout";
import { Toaster } from "react-hot-toast";
import LinkDashboard from "./pages/LinkDashboard";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomeLayout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "stats/:link_id",
          element: <LinkDashboard />,
        },
      ],
    },
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "register",
      element: <Register />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router}></RouterProvider>
      <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
    </>
  );
};

export default App;

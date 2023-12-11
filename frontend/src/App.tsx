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
import HomeLayout from "./layout/HomeLayout";
import { Toaster } from "react-hot-toast";
import LinkStatsDashboard from "./pages/LinkStatsDashboard";
import Links from "./pages/Links";
import EditShortendLink from "./pages/EditShortendLink";
import Settings from "./pages/Settings";
import Temp from "./pages/Temp";

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
          path: "links",
          children: [
            {
              index: true,
              element: <Links />,
            },
            {
              path: ":linkId",
              children: [
                {
                  index: true,
                  element: <LinkStatsDashboard />,
                },
                {
                  path: "edit",
                  element: <EditShortendLink />,
                },
              ],
            },
          ],
        },
        {
          path: "settings",
          element: <Settings />,
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
    <div className="relative">
      <RouterProvider router={router}></RouterProvider>
      <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
    </div>
  );
};

export default App;

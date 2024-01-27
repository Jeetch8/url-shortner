import LinkStatsDashboard from "@/pages/LinkStatsDashboard";
import Links from "@/pages/Links";
import EditShortendLink from "@/pages/EditShortendLink";
import Settings from "@/pages/Settings";
import BillingAndUsuage from "@/pages/BillingAndUsuage";
import Subscribe from "@/pages/Subscribe";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import HomeLayout from "@/layout/HomeLayout";
import { RouteObject } from "react-router-dom";

export const routes: RouteObject[] = [
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
        path: "billing-and-usuage",
        element: <BillingAndUsuage />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "subscribe",
        element: <Subscribe />,
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
];

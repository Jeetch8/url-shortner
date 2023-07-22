import React, { useEffect, useRef, useState } from "react";
import { useSidebarContext } from "../context/SidebarContext";
import { IoAdd, IoHome } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { IoSettingsSharp } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { useWindowSize } from "../hooks/useWindowSize";
import { clsx } from "clsx";
import { IoMdAdd } from "react-icons/io";
import { BiLink } from "react-icons/bi";

const navList = [
  {
    name: "Home",
    icon: <IoHome size={20} />,
    path: "/",
  },
  {
    name: "Links",
    icon: <BiLink size={24} />,
    path: "/links",
  },
  {
    name: "Settings",
    icon: <IoSettingsSharp size={22} />,
    path: "/settings",
  },
];

const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebarContext();
  const sidebarRef = useRef(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { width, height } = useWindowSize();
  const [sideBarStatus, setSidebarStatus] = useState({
    status: "minimzed",
    width: "300px",
  }); //minimzed, mid, maximized

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    if (width < 750)
      setSidebarStatus({
        status: "minimized",
        width: "100vw",
      });
    else if (width >= 750 && width <= 1180)
      setSidebarStatus({
        status: "mid",
        width: "70px",
      });
    else
      setSidebarStatus({
        status: "maximized",
        width: "300px",
      });
  }, [width]);

  return (
    <div
      className={clsx(
        `sticky left-0 top-0 bg-white h-screen border-r-2 border-neutral-200 w-[${sideBarStatus.width}]`
      )}
      ref={sidebarRef}
    >
      <div className="px-3 py-2 flex flex-col justify-between h-full">
        <div>
          <div className="border-b-2 border-neutral-200 mb-2">
            <h2 className="text-2xl font-bold mt-3 ml-2">
              S{sideBarStatus.status !== "mid" && "hort"}
            </h2>
            <button
              className="mt-6 mb-3 bg-blue-700 py-2 rounded-md px-[9px] hover:bg-blue-800 duration-500 shadow-md  motion-reduce:animate-pulse"
              onClick={() => navigate("/links/create")}
            >
              <IoMdAdd
                color="white"
                className="mx-auto font-semibold inline"
                size={22}
              />
              <span className="inline text-white font-semibold ml-3 pr-2">
                Create New Link
              </span>
            </button>
          </div>
          <div>
            {navList.map((nav) => (
              <li
                key={nav.name}
                className={`flex group items-center gap-x-2 font-semibold text-xl py-3 w-full hover:bg-blue-100 mt-2 rounded-lg cursor-pointer relative ${
                  pathname === nav.path ? "bg-blue-100" : ""
                }`}
                onClick={() => {
                  navigate(nav.path);
                  toggleSidebar();
                }}
              >
                <span className="px-2 py-1">{nav.icon}</span>
                {sideBarStatus.status !== "mid" && nav.name}
                {sideBarStatus.status === "mid" && (
                  <span className="absolute text-sm font-medium bg-neutral-700 text-white px-4 rounded-sm py-2 left-11 z-[1000] group-hover:block hidden">
                    {nav.name}
                  </span>
                )}
              </li>
            ))}
          </div>
        </div>
        <div className="border-t-2 pt-2">
          <div
            className="flex items-center gap-x-2 font-semibold text-xl py-3 w-full hover:bg-blue-100 rounded-lg pl-2 cursor-pointer"
            onClick={logout}
          >
            <MdLogout size={22} />
            {sideBarStatus.status !== "mid" && "Logout"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

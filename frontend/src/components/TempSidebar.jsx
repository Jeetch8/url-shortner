import React, { useRef } from "react";
import { useSidebarContext } from "../context/SidebarContext";
import { RxCross1 } from "react-icons/rx";
import { IoHome } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { IoSettingsSharp } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { useWindowSize } from "../hooks/useWindowSize";
const navList = [
  {
    name: "Home",
    icon: <IoHome size={20} />,
    path: "/",
  },
  {
    name: "Profile",
    icon: <CgProfile size={22} />,
    path: "/profile",
  },
  {
    name: "Settings",
    icon: <IoSettingsSharp size={22} />,
    path: "/settings",
  },
];

const Sidebar = () => {
  const blackScreenRef = useRef(null);
  const { isSidebarOpen, toggleSidebar } = useSidebarContext();
  const sidebarRef = useRef(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { width, height } = useWindowSize();

  // width: 1180
  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      toggleSidebar();
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    isSidebarOpen && (
      <div
        className="absolute top-0 left-0 bg-[rgba(0,0,0,0.1)] w-screen h-screen z-50"
        ref={blackScreenRef}
        onClick={handleClickOutside}
      >
        <div className="w-[300px] bg-white h-screen" ref={sidebarRef}>
          <div className="px-3 py-2">
            <div className="flex justify-end">
              <button
                className="hover:bg-slate-100 px-2 py-2 rounded-full"
                onClick={toggleSidebar}
              >
                <RxCross1 size={25} />
              </button>
            </div>
            <div className="h-full w-full mt-8 flex justify-between flex-col">
              <div>
                {navList.map((nav) => (
                  <li
                    key={nav.name}
                    className={`flex items-center gap-x-2 font-semibold text-xl py-3 w-full hover:bg-slate-200 rounded-lg pl-2 cursor-pointer ${
                      pathname === nav.path ? "bg-slate-200" : ""
                    }`}
                    onClick={() => {
                      navigate(nav.path);
                      toggleSidebar();
                    }}
                  >
                    {nav.icon}
                    {nav.name}
                  </li>
                ))}
              </div>
              <div
                className="flex items-center gap-x-2 font-semibold text-xl py-3 w-full hover:bg-slate-200 rounded-lg pl-2 cursor-pointer"
                onClick={logout}
              >
                <MdLogout size={22} />
                Logout
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Sidebar;

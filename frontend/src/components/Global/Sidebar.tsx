import { useEffect, useRef } from "react";
import { useSidebarContext } from "@/context/SidebarContext";
import { IoHome } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoSettingsSharp } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { useWindowSize } from "@/hooks/useWindowSize";
import { IoMdAdd } from "react-icons/io";
import { BiLink } from "react-icons/bi";
import { RiBillFill } from "react-icons/ri";
import { Tooltip } from "react-tooltip";
import { IoMdClose } from "react-icons/io";
import { useUserContext } from "@/context/UserContext";

const navList: { name: string; icon: JSX.Element; path: string }[] = [
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
  {
    name: "Billing & Usuage",
    icon: <RiBillFill size={22} />,
    path: "/billing-and-usuage",
  },
];

const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar, setIsModalOpen } = useSidebarContext();
  const sidebarRef = useRef(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const { user } = useUserContext();

  const can_generate_links =
    (user?.user.generated_links.length as number) >=
    (user?.product?.features.link_generation as number);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    if (isSidebarOpen && width < 768) toggleSidebar();
  }, [pathname]);

  useEffect(() => {
    if (isSidebarOpen) {
      if (width < 768) toggleSidebar();
    }
    if (!isSidebarOpen) {
      if (width > 767) toggleSidebar();
    }
  }, [width]);

  return (
    <div
      className="fixed left-0 top-0 bg-white z-50 h-screen border-r-2 transition-all border-neutral-200 w-[100vw] md:w-[70px] xl:w-[240px] duration-500"
      style={{ display: isSidebarOpen ? "block" : "none" }}
      ref={sidebarRef}
    >
      <div className="px-3 py-2 flex flex-col justify-between h-full">
        <div>
          <div className="border-b-2 border-neutral-200 mb-2">
            <div className="mt-[5px] ml-2 flex gap-x-2">
              <button
                onClick={toggleSidebar}
                className="hover:bg-stone-100 rounded-md md:hidden"
              >
                <IoMdClose size={24} />
              </button>
              <h2
                className="text-2xl font-bold cursor-pointer"
                onClick={() => navigate("/")}
              >
                S<span className="md:hidden xl:inline-block">hort</span>
              </h2>
            </div>
            <button
              id="upgrade_required"
              className="mt-6 mb-3 bg-blue-700 py-2 rounded-md px-[9px] hover:bg-blue-800 duration-500 shadow-md  motion-reduce:animate-pulse disabled:bg-blue-300"
              onClick={() => setIsModalOpen(true)}
              disabled={can_generate_links}
            >
              <IoMdAdd
                color="white"
                className="mx-auto font-semibold inline"
                size={22}
              />
              <span className="inline text-white font-semibold ml-3 pr-2 md:hidden xl:inline-block whitespace-nowrap">
                Create New Link
              </span>
            </button>
            {can_generate_links && (
              <Tooltip anchorSelect="#upgrade_required" clickable>
                <Link to={"/subscribe"} className="underline">
                  Upgrade
                </Link>
                <span> required to create more links</span>
              </Tooltip>
            )}
          </div>
          <div>
            <ul>
              {navList.map((nav) => (
                <li
                  aria-label={"nav_btn_" + nav.name}
                  key={nav.name}
                  className={`group gap-x-2 font-semibold text-xl px-1 py-3 w-full hover:bg-blue-100 mt-2 rounded-lg cursor-pointer list-none  ${
                    pathname === nav.path ? "bg-blue-100" : ""
                  }`}
                  data-tooltip-id={"tooltip-" + nav.name}
                  data-tooltip-content={nav.name}
                  onClick={() => {
                    navigate(nav.path);
                  }}
                >
                  <span className="px-2 inline-block">{nav.icon}</span>
                  <span className="md:hidden xl:inline-block inline-block">
                    {nav.name}
                  </span>
                  <Tooltip id={"tooltip-" + nav.name} className="xl:hidden" />
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t-2 py-2 mb-3">
          <div
            className="flex items-center gap-x-2 font-semibold text-xl py-3 w-full hover:bg-blue-100 rounded-lg pl-2 cursor-pointer"
            onClick={logout}
          >
            <MdLogout size={22} />
            <span className="md:hidden xl:inline-block">Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

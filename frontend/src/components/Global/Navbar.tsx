import { useCallback, useEffect, useRef, useState } from "react";
import { MdOutlineArrowDropDown, MdOutlineArrowDropUp } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/UserContext";
import { IoMdSettings } from "react-icons/io";
import toast from "react-hot-toast";
import { HiMenuAlt3 } from "react-icons/hi";
import { useSidebarContext } from "@/context/SidebarContext";

const Navbar = () => {
  const [isDropDownOpen, setDropDownOpen] = useState(false);
  const dropDownRef = useRef<HTMLDivElement | null>(null);
  const { toggleSidebar } = useSidebarContext();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const globalUser = user?.user;
  const { pathname } = useLocation();

  const handleClickOutside = useCallback((event: any) => {
    if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
      setDropDownOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);

    return () =>
      document.removeEventListener("click", handleClickOutside, true);
  }, []);

  useEffect(() => {
    setDropDownOpen(false);
  }, [pathname]);

  const handleUserLogout = async () => {
    await localStorage.clear();
    toast.success("Logged out");
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <nav className="h-[60px] fixed top-0 left-0 z-0 border-b-2 items-center px-4 border-b-neutral-200 w-full text-black bg-white z-10">
      <div className="mx-auto min-w-[500px] w-full flex items-center md:justify-end justify-between h-full">
        <div className="md:hidden flex items-center gap-x-3">
          <button
            className="hover:bg-stone-100 rounded-sm"
            onClick={toggleSidebar}
          >
            <HiMenuAlt3 size={24} />
          </button>
          <p
            className="text-2xl font-bold cursor-pointer"
            onClick={() => navigate("/")}
          >
            Short
          </p>
        </div>
        <div className="flex gap-x-4 items-center">
          {user?.user.subscription_id.plan_name === "trial" && (
            <button
              className="bg-blue-700 rounded-full text-white font-semibold px-4 text-sm h-fit py-2 duration-5000 motion-reduce:animate-pulse"
              onClick={() => navigate("/subscribe")}
            >
              Subscribe
            </button>
          )}
          <div className="flex items-center gap-x-2 relative">
            <div>
              <div
                className="w-[41px] h-[41px]"
                style={{
                  border: "1px solid white",
                  backgroundColor: "white",
                  backgroundSize: "contain",
                  borderRadius: "100%",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundImage: `url(${
                    globalUser?.profile_img ??
                    "https://www.gravatar.com/avatar/14d89cd52e0319f5508f6d8b4213d286.jpg?s=200&d=mm"
                  })`,
                }}
              ></div>
            </div>
            <button
              role="dropdown_toggle"
              className="flex items-center gap-x-1 cursor-pointer"
              onClick={() => setDropDownOpen((prev) => !prev)}
            >
              {globalUser?.name}
              {isDropDownOpen ? (
                <MdOutlineArrowDropUp />
              ) : (
                <MdOutlineArrowDropDown />
              )}
            </button>
            {isDropDownOpen && (
              <div
                className="absolute bg-white top-9 right-0 w-[120px] h-fit border-2 border-neutral-200 px-2 py-2 z-50 rounded-md"
                ref={dropDownRef}
              >
                <ul>
                  <li
                    className="py-1 pl-1 hover:bg-neutral-200 cursor-pointer rounded-md"
                    onClick={() => {
                      navigate("/settings");
                      setDropDownOpen(false);
                    }}
                  >
                    <IoMdSettings className="inline" /> Settings
                  </li>
                  <hr />
                  <li
                    className="py-1 pl-1 hover:bg-neutral-200 cursor-pointer rounded-md"
                    onClick={handleUserLogout}
                  >
                    <IoIosLogOut className="inline" /> Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      {user?.subscription_warninig.visible && (
        <div className="h-[25px] bg-stone-200 text-center text-sm font-semibold w-full ml-4 py-1">
          {user?.subscription_warninig.text}{" "}
          <button
            onClick={() => navigate("/upgrade")}
            className="bg-blue-700 rounded-md text-sm px-2 text-white"
          >
            subscribe
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

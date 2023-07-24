import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdOutlineArrowDropDown, MdOutlineArrowDropUp } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useSidebarContext } from "../context/SidebarContext";
import { useUserContext } from "../context/UserContext";
import { IoMdSettings } from "react-icons/io";

const Navbar = () => {
  const [isDropDownOpen, setDropDownOpen] = useState(false);
  const dropDownRef = useRef(null);
  const { toggleSidebar } = useSidebarContext();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { pathname } = useLocation();

  const handleClickOutside = useCallback((event) => {
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

  return (
    <nav className="h-[60px] border-b-2 items-center px-4 border-b-neutral-200 w-full text-black bg-white">
      <div className="mx-auto min-w-[500px] w-full flex items-center justify-end h-full">
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
                  user?.profile_img ??
                  "https://www.gravatar.com/avatar/14d89cd52e0319f5508f6d8b4213d286.jpg?s=200&d=mm"
                })`,
              }}
            ></div>
          </div>
          <p
            className="flex items-center gap-x-1 cursor-pointer"
            onClick={() => setDropDownOpen((prev) => !prev)}
          >
            {user?.name}
            {isDropDownOpen ? (
              <MdOutlineArrowDropUp />
            ) : (
              <MdOutlineArrowDropDown />
            )}
          </p>
          {isDropDownOpen && (
            <div
              className="absolute bg-white top-9 right-0 w-[120px] h-fit rounded-sm border-[1px] border-stone-500 px-2 py-2 z-50"
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
                <li className="py-1 pl-1 hover:bg-neutral-200 cursor-pointer rounded-md">
                  <IoIosLogOut className="inline" /> Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

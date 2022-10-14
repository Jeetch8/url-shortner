import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { getUserFromLocalStorage } from "../utils/localstorage";
import { MdOutlineArrowDropDown, MdOutlineArrowDropUp } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isDropDownOpen, setDropDownOpen] = useState(false);
  const user = useMemo(() => getUserFromLocalStorage().user);
  const dropDownRef = useRef(null);
  const navigate = useNavigate();

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

  return (
    <nav className="bg-blue-600 h-[50px] items-center px-4">
      <div className="mx-auto min-w-[500px] w-full flex items-center justify-between h-full">
        <div>
          <RxHamburgerMenu color="white" size={30} />
        </div>
        <div className="flex items-center gap-x-2 relative">
          <img
            src={
              user?.profileImg ??
              "https://www.gravatar.com/avatar/14d89cd52e0319f5508f6d8b4213d286.jpg?s=200&d=mm"
            }
            width={41}
            height={41}
            className=" rounded-full"
            alt=""
          />
          <p
            className="text-white flex items-center gap-x-1 cursor-pointer"
            onClick={() => setDropDownOpen((prev) => !prev)}
          >
            {user.name}
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
                    navigate("/profile");
                    setDropDownOpen(false);
                  }}
                >
                  <FaUser className="inline" /> Profile
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

import React from "react";
import SecurityAndAuth from "../components/Settings/Security&Auth";
import Profile from "../components/Settings/Profile";
import { useUserContext } from "../context/UserContext";
import { twMerge } from "tailwind-merge";

const Settings = () => {
  const { user } = useUserContext();

  return (
    <div
      className={twMerge(
        "max-w-[1600px] mx-auto pt-4",
        user?.subscription_warninig.visible && "pt-[35px]"
      )}
    >
      <div className="bg-white rounded-lg px-5 py-6">
        <Profile />
        <div>
          <SecurityAndAuth />
          <div className="w-full border-t-2 mt-6">
            <button className="bg-red-700 text-white mt-6 px-5 py-2 rounded-md hover:bg-red-800">
              Delete account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

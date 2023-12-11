import React, { useEffect, useState } from "react";
import { FiEyeOff, FiEye } from "react-icons/fi";
import { twMerge } from "tailwind-merge";

const PasswordInput = ({ id, register, styles }) => {
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (showPassword) {
      setTimeout(() => {
        if (showPassword) setShowPassword(false);
      }, 2000);
    }
  }, [showPassword]);

  return (
    <div
      className={twMerge(
        "bg-white flex items-center h-fit w-fit rounded-md",
        styles
      )}
    >
      <input
        {...register}
        className="rounded-md outline-none text-black px-2 py-1 mt-1"
        type={showPassword ? "text" : "password"}
        name={id}
        id={id}
      />
      <button
        type="button"
        className="mx-2 h-fit"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <FiEyeOff color="black" /> : <FiEye color="black" />}
      </button>
    </div>
  );
};

export default PasswordInput;

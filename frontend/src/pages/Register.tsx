import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { base_url } from "../utils/base_url";
import {
  getTokenFromLocalStorage,
  setTokenInLocalStorage,
} from "../utils/localstorage";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import ScaleLoader from "react-spinners/ScaleLoader";
import { FieldErrors, useForm } from "react-hook-form";
import ErrorDisplayComp from "@/components/Form/ErrorDisplayComp";
import { emailRegex, passwordRegex } from "@/utils/RegExp";

// export const ErrorComp = ({
//   error,
//   name,
// }: {
//   error: FieldErrors<{
//     email: string;
//     password: string;
//     name: string;
//     confirmPassword: string;
//   }>;
//   name: "email" | "password" | "name" | "confirmPassword";
// }) => {
//   return (
//     <p className="text-red-600 font-semibold text-sm">{error[name]?.message}</p>
//   );
// };

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    formState: { errors },
    handleSubmit,
    register,
    getValues,
  } = useForm({
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });
  const { fetchState, doFetch } = useFetch<{
    token: string;
  }>({
    url: base_url + "/auth/register",
    method: "POST",
    authorized: false,
    onSuccess: (res) => {
      setTokenInLocalStorage(res.token);
      toast.success("Registeration success");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    },
    onError: (err) => {
      console.log(err);
      if (err.message === "Email already exists")
        toast.error("Email already exist", { duration: 5000 });
      else toast.error("Somethign went wrong", { duration: 5000 });
    },
  });

  useEffect(() => {
    const token = getTokenFromLocalStorage();
    if (token) {
      navigate("/");
    }
  }, []);

  const handleFormSubmit = (data: any) => {
    console.log(data, "form");
    doFetch(data);
  };

  return (
    <div className="flex justify-center items-center w-full h-[100vh] bg-black text-white">
      <div>
        <h2 className="font-semibold text-3xl text-center mb-3">Register</h2>
        <div className="border-2 px-10 w-fit py-10 rounded-md">
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="max-w-[300px] w-full">
              <label className="font-semibold" htmlFor="name">
                Full Name
              </label>

              <input
                className="rounded-md outline-none text-black px-2 py-1 border-2 mt-1 w-full"
                type="text"
                {...register("name", {
                  required: {
                    message: "Name is required",
                    value: true,
                  },
                })}
              />
              <ErrorDisplayComp error={errors.name} />
            </div>
            <div className="max-w-[300px] w-full mt-4">
              <label className="font-semibold" htmlFor="email">
                Email
              </label>
              <br />
              <input
                className="rounded-md outline-none text-black px-2 py-1 border-2 mt-1 w-full"
                type="text"
                {...register("email", {
                  required: {
                    value: true,
                    message: "Email is required",
                  },
                  pattern: {
                    value: emailRegex,
                    message: "Email is valid",
                  },
                })}
              />
              <ErrorDisplayComp error={errors.email} />
            </div>
            <div className="w-full max-w-[300px] mt-4">
              <label className="font-semibold" htmlFor="password">
                Password
              </label>
              <div className="bg-white flex items-center h-fit w-fit rounded-md">
                <input
                  className="rounded-md outline-none text-black  w-[260px] px-2 py-1 mt-1"
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: {
                      value: true,
                      message: "Password is required",
                    },
                    pattern: {
                      value: passwordRegex,
                      message:
                        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
                    },
                  })}
                />
                <button
                  type="button"
                  className="mx-2 h-fit"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff color="black" />
                  ) : (
                    <FiEye color="black" />
                  )}
                </button>
              </div>
              <ErrorDisplayComp error={errors.password} />
            </div>
            <div className="w-full max-w-[300px]">
              <label className="font-semibold mt-4" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="bg-white flex items-center h-fit w-fit rounded-md">
                <input
                  className="rounded-md outline-none text-black w-[260px] px-2 py-1 mt-1"
                  type={showPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: {
                      value: true,
                      message: "Password is required",
                    },
                    validate: (value) =>
                      value === getValues("password") ||
                      "Passwords do not match",
                  })}
                />
                <button
                  type="button"
                  className="mx-2 h-fit"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff color="black" />
                  ) : (
                    <FiEye color="black" />
                  )}
                </button>
              </div>
              <ErrorDisplayComp error={errors.confirmPassword} />
            </div>
            <button
              className="px-6 py-3 rounded-md w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 mt-6"
              type="submit"
              disabled={fetchState === "loading"}
            >
              {fetchState === "loading" ? (
                <ScaleLoader height={13} />
              ) : (
                "Submit"
              )}
            </button>
          </form>
          <button
            onClick={() =>
              doFetch({
                name: "Jeet Chawda",
                email: "Jeetkumar0898@gmail.com",
                password: "JEetk8035!@",
                confirmPassword: "JEetk8035!@",
              })
            }
            className="bg-blue-700 font-semibold w-full py-3 rounded-md mt-2"
          >
            Register Demo User
          </button>
          <Link
            to={"/login"}
            className="text-blue-500 underline block mt-4 text-center"
          >
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

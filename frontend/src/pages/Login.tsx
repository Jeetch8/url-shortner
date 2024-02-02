import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { base_url } from "../utils/base_url";
import {
  setTokenInLocalStorage,
  getTokenFromLocalStorage,
} from "../utils/localstorage";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiEyeOff, FiEye } from "react-icons/fi";
import ScaleLoader from "react-spinners/ScaleLoader";
import { FieldErrors, useForm } from "react-hook-form";
import { emailRegex, passwordRegex } from "@/utils/RegExp";
import ErrorDisplayComp from "@/components/Form/ErrorDisplayComp";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { fetchState, doFetch } = useFetch<{ token: string }>({
    url: base_url + "/auth/login",
    method: "POST",
    authorized: false,
    onSuccess: (res) => {
      setTokenInLocalStorage(res.token);
      toast.success("Logged in");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    },
    onError: (err) => {
      console.log(err);
      toast.error(err.message);
    },
  });

  useEffect(() => {
    const token = getTokenFromLocalStorage();
    if (token) {
      navigate("/");
    }
  }, []);

  const handleFormSubmit = (e: any) => {
    console.log(e);
    doFetch(e);
  };

  return (
    <div className="flex justify-center items-center w-full h-[100vh] bg-black text-white">
      <div>
        <h2 className="font-semibold text-3xl text-center mb-3">Login</h2>
        <div className="border-2 px-10 w-fit py-10 rounded-md">
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <label className="font-semibold" htmlFor="email">
              Email
            </label>
            <br />
            <input
              {...register("email", {
                pattern: {
                  value: emailRegex,
                  message: "Email is not valid",
                },
                required: {
                  value: true,
                  message: "Email is required",
                },
              })}
              placeholder="Email"
              className="rounded-md outline-none text-black w-[300px] px-2 py-1 border-2 mt-1"
              type="text"
            />
            <br />
            <ErrorDisplayComp error={errors.email} />
            <label className="font-semibold" htmlFor="password">
              Password
            </label>
            <br />
            <div className="w-[300px]">
              <div className={"bg-white flex items-center h-fit rounded-md"}>
                <input
                  className="rounded-md outline-none w-[260px] text-black px-2 py-1 mt-1"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: {
                      value: true,
                      message: "Password is required",
                    },
                    pattern: {
                      value: passwordRegex,
                      message:
                        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one symbol",
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
            <br />
            <button
              className="px-6 py-3 rounded-md w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300"
              type="submit"
              disabled={fetchState === "loading"}
            >
              {fetchState === "loading" ? (
                <ScaleLoader role="loader" height={13} />
              ) : (
                "Submit"
              )}
            </button>
          </form>
          {/* <SSOSignIn /> */}
          <Link
            to={"/forgot-password"}
            className="text-blue-500 underline block text-center"
          >
            Forgot password ?
          </Link>
          <Link
            to={"/register"}
            className="text-blue-500 underline block text-center"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

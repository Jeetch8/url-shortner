import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
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
import SSOSignIn from "../components/SSOSignIn";
import { GoogleOAuthProvider } from "@react-oauth/google";

const emailReg = new RegExp(
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
);
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [emailValidateErr, setEmailValidateErr] = useState<string>();
  const navigate = useNavigate();
  const {
    fetchState,
    doFetch,
    dataRef: fetchData,
    errorRef: fetchError,
  } = useFetch({
    headers: {},
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
      toast.error(err.message);
    },
  });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const token = getTokenFromLocalStorage();
    if (token) {
      navigate("/");
    }
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const targetName = e.target.name;
    const targetValue = e.target.value;
    if (targetName === "email") {
      if (!emailReg.test(targetValue)) {
        setEmailValidateErr("Invalid email");
      } else {
        setEmailValidateErr(undefined);
      }
    }
    setFormData((prev) => {
      return { ...prev, [targetName]: targetValue };
    });
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    await doFetch(formData);
  };

  return (
    <GoogleOAuthProvider clientId="448644767792-rnc9t8vjng35nieqld244a8lfcctb8kk.apps.googleusercontent.com">
      <div className="flex justify-center items-center w-full h-[100vh] bg-black text-white">
        <div>
          <h2 className="font-semibold text-3xl text-center mb-3">Login</h2>
          <div className="border-2 px-10 w-fit py-10 rounded-md">
            <form onSubmit={handleFormSubmit}>
              <label className="font-semibold" htmlFor="email">
                Email
              </label>
              <br />
              <input
                onChange={handleInputChange}
                className="rounded-md outline-none text-black px-2 py-1 border-2 mt-1 w-full"
                type="text"
                name="email"
                id="email"
              />
              <br />
              {emailValidateErr && (
                <p className="text-red-500 text-sm">{emailValidateErr}</p>
              )}
              <label className="font-semibold" htmlFor="password">
                Password
              </label>
              <br />
              <div
                className={"bg-white flex items-center h-fit w-fit rounded-md"}
              >
                <input
                  onChange={handleInputChange}
                  className="rounded-md outline-none text-black px-2 py-1 mt-1"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
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
              <br />
              <button
                className="px-6 py-3 rounded-md w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300"
                type="submit"
                disabled={fetchState === "loading" || emailValidateErr}
              >
                {fetchState === "loading" ? (
                  <ScaleLoader height={13} />
                ) : (
                  "Submit"
                )}
              </button>
            </form>
            <SSOSignIn />
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
    </GoogleOAuthProvider>
  );
};

export default Login;

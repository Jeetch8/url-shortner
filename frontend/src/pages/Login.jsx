import React, { useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { base_url } from "../utils/base_url";
import { setTokenInLocalStorage } from "../utils/localstorage";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const {
    fetchState,
    doFetch,
    dataRef: fetchData,
    errorRef: fetchError,
  } = useFetch({
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
    onError: () => {
      toast.error("Login failed");
    },
  });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) =>
    setFormData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });

  const handleLogin = async (e) => {
    e.preventDefault();
    await doFetch(formData);
  };

  return (
    <div>
      <div className="border-2 px-10 w-fit py-10">
        <form action="">
          <label htmlFor="email">Email</label>
          <br />
          <input
            onChange={handleInputChange}
            className="border-2"
            type="text"
            name="email"
          />
          <br />
          <label htmlFor="password">Password</label>
          <br />
          <input
            onChange={handleInputChange}
            className="border-2"
            type="password"
            name="password"
          />
          <br />
          <button
            className="border-2 px-6 py-2 rounded-md"
            type="submit"
            onClick={handleLogin}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

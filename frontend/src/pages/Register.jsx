import React, { useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { base_url } from "../utils/base_url";
import { setTokenInLocalStorage } from "../utils/localstorage";
import toast from "react-hot-toast";

const Register = () => {
  const {
    fetchState,
    dataRef: fetchData,
    errorRef: fetchError,
    doFetch,
  } = useFetch({
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
    onError: () => {
      toast.error("Somethign went wrong");
    },
  });
  const [formData, setFormData] = useState({
    name: "",
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
          <label htmlFor="name">Name</label>
          <br />
          <input
            onChange={handleInputChange}
            className="border-2"
            type="text"
            name="name"
          />
          <br />
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

export default Register;

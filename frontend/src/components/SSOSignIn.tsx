import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { BsGithub } from "react-icons/bs";

const SSOSignIn = () => {
  const handleGithubLogin = () => {
    window.location.href = "http://localhost:5000/api/v1/auth/github";
  };

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      fetch("http://localhost:5000/api/v1/auth/github/callback", {
        body: JSON.stringify({ code }),
      })
        .then((res) => {
          localStorage.setItem("token", res.data.token);
          // Redirect or update app state here
        })
        .catch((error) => console.error("GitHub login error", error));
    }
  }, []);
  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/auth/google", {
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      //   localStorage.setItem('token', res.data.token);
      // Redirect or update app state here
    } catch (error) {
      console.error("Google login error", error);
    }
  };
  return (
    <div>
      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => toast.error("Login failed")}
      />
      <button
        onClick={handleGithubLogin}
        className="bg-white text-black flex items-center justify-center w-full py-2 gap-x-2"
      >
        <BsGithub />
        Login with github
      </button>
    </div>
  );
};

export default SSOSignIn;

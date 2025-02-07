import React from 'react';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { BsGithub } from 'react-icons/bs';

const SSOSignIn = () => {
  const handleGithubLogin = () => {
    window.location.href = 'http://localhost:5000/api/v1/auth/github';
  };

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      fetch('http://localhost:5000/api/v1/auth/github/callback', {
        body: JSON.stringify({ code }),
      })
        .then((res: any) => {
          localStorage.setItem('token', res.data.token);
          // Redirect or update app state here
        })
        .catch((error) => console.error('GitHub login error', error));
    }
  }, []);

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    try {
      await fetch('http://localhost:5000/api/v1/auth/google/callback', {
        method: 'POST',
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      //   localStorage.setItem('token', res.data.token);
      // Redirect or update app state here
    } catch (error) {
      console.error('Google login error', error);
    }
  };

  const tempLogin = async () => {
    const res = await fetch('http://localhost:5000/api/v1/auth/google', {
      mode: 'no-cors',
      headers: {
        'Access-Control-Allow-Origin': 'https://account.google.com',
      },
    });
    console.log(res);
  };

  return (
    <div>
      <div className="mt-4 mx-auto w-fit">
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => toast.error('Login failed')}
        />
      </div>
      <button onClick={tempLogin} className="border-2 bg-white text-black">
        Login with google
      </button>
      <button
        onClick={handleGithubLogin}
        className="bg-white text-black flex items-center justify-center w-[230px] mx-auto py-2 gap-x-2 rounded-md border-2 border-black mt-4"
      >
        <BsGithub />
        Login with github
      </button>
    </div>
  );
};

export default SSOSignIn;

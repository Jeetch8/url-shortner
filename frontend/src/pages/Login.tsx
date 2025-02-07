import { useEffect } from 'react';
import { useFetch } from '../hooks/useFetch';
import { base_url } from '../utils/base_url';
import {
  setTokenInLocalStorage,
  getTokenFromLocalStorage,
} from '../utils/localstorage';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { useForm } from 'react-hook-form';
import { emailRegex, passwordRegex } from '@/utils/RegExp';
import PasswordInput from '@/components/Form/PasswordInput';
import HookFormInput from '@/components/Form/HookFormInput';

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const navigate = useNavigate();
  const { fetchState, doFetch } = useFetch<{ token: string }>({
    url: base_url + '/auth/login',
    method: 'POST',
    authorized: false,
    onSuccess: (res) => {
      setTokenInLocalStorage(res.token);
      toast.success('Logged in');
      setTimeout(() => {
        navigate('/');
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
      navigate('/');
    }
  }, []);

  const handleFormSubmit = (data: any) => {
    doFetch(data);
  };

  const handleLoginDemoUser = async () => {
    await doFetch({
      email: 'demo@demo.com',
      password: 'PAssword!@12',
    });
  };

  return (
    <div className="flex justify-center items-center w-full h-[100vh] bg-black text-white">
      <div>
        <h2 className="font-semibold text-3xl text-center mb-3">Login</h2>
        <div className="border-2 px-10 w-fit py-10 rounded-md">
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="max-w-[300px] w-full">
              <label className="font-semibold" htmlFor="email">
                Email
              </label>
              <HookFormInput
                register={register}
                fieldName="email"
                fieldRules={{
                  required: {
                    value: true,
                    message: 'Email is required',
                  },
                  pattern: {
                    value: emailRegex,
                    message: 'Email is not valid',
                  },
                }}
                inputClassName="rounded-md outline-none text-black px-2 py-1 border-2 mt-1 w-full"
                placeholder="Email"
                errors={errors.email}
              />
            </div>

            <div className="w-full max-w-[300px] mt-4">
              <label className="font-semibold" htmlFor="password">
                Password
              </label>
              <PasswordInput
                fieldName="password"
                register={register}
                fieldRules={{
                  required: {
                    value: true,
                    message: 'Password is required',
                  },
                  pattern: {
                    value: passwordRegex,
                    message:
                      'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one symbol',
                  },
                }}
                inputClassName="rounded-md outline-none text-black w-[260px] px-2 py-2"
                outerClassName="mt-1"
                placeholder="Password"
                errors={errors.password}
              />
            </div>

            <button
              className="px-6 py-3 rounded-md w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 mt-6"
              type="submit"
              disabled={fetchState === 'loading'}
            >
              {fetchState === 'loading' ? (
                <ScaleLoader role="loader" height={13} />
              ) : (
                'Submit'
              )}
            </button>
          </form>
          <button
            type="button"
            onClick={handleLoginDemoUser}
            className="bg-blue-700 font-semibold w-full py-3 rounded-md mt-2"
          >
            Guest User Login
          </button>

          <Link
            to="/forgot-password"
            className="text-blue-500 underline block mt-4 text-center"
          >
            Forgot password?
          </Link>
          <Link
            to="/register"
            className="text-blue-500 underline block mt-2 text-center"
          >
            Don't have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

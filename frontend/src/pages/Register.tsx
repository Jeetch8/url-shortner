import { useEffect } from 'react';
import { useFetch } from '../hooks/useFetch';
import { base_url } from '../utils/base_url';
import {
  getTokenFromLocalStorage,
  setTokenInLocalStorage,
} from '../utils/localstorage';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { useForm } from 'react-hook-form';
import { emailRegex, passwordRegex } from '@/utils/RegExp';
import PasswordInput from '@/components/Form/PasswordInput';
import HookFormInput from '@/components/Form/HookFormInput';
console.log(import.meta.env.VITE_base_url);

const Register = () => {
  const navigate = useNavigate();
  const {
    formState: { errors },
    handleSubmit,
    watch,
    register,
  } = useForm({
    defaultValues: {
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
    },
  });
  const { fetchState, doFetch } = useFetch<{
    token: string;
  }>({
    url: base_url + '/auth/register',
    method: 'POST',
    authorized: false,
    onSuccess: (res) => {
      setTokenInLocalStorage(res.token);
      toast.success('Registeration success');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  useEffect(() => {
    const token = getTokenFromLocalStorage();
    if (token) {
      navigate('/');
    }
  }, []);

  const handleFormSubmit = async (data: any) => {
    await doFetch(data);
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
              <HookFormInput
                register={register}
                errors={errors.name}
                fieldName="name"
                fieldRules={{
                  required: {
                    message: 'Name is required',
                    value: true,
                  },
                }}
                inputClassName="rounded-md outline-none text-black px-2 py-1 border-2 mt-1 w-full"
                placeholder="Name"
              />
            </div>
            <div className="max-w-[300px] w-full mt-4">
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
                inputClassName="rounded-md outline-none text-black  w-[260px] px-2 py-2"
                outerClassName="mt-1"
                placeholder="Password"
                errors={errors.password}
              />
            </div>
            <div className="w-full max-w-[300px] mt-4">
              <label className="font-semibold" htmlFor="password">
                Confirm Password
              </label>
              <PasswordInput
                fieldName="confirmPassword"
                register={register}
                fieldRules={{
                  required: {
                    value: true,
                    message: 'Password confirmation is required',
                  },
                  validate: (value) =>
                    value === watch('password') || 'Passwords do not match',
                }}
                inputClassName="rounded-md outline-none text-black  w-[260px] px-2 py-2"
                outerClassName="mt-1"
                placeholder="Confirm password"
                errors={errors.confirmPassword}
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
          <Link
            to={'/login'}
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

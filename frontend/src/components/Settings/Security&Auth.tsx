import PasswordInput from "../Form/PasswordInput";
import { useFetch } from "../../hooks/useFetch";
import { base_url } from "../../utils/base_url";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import ScaleLoader from "react-spinners/ScaleLoader";
import { redirect } from "react-router-dom";

const SecurityAndAuth = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: { oldPassword: "", newPassword: "", confirmNewPassword: "" },
  });

  const { fetchState } = useFetch({
    url: base_url + "/user/change-password",
    authorized: true,
    method: "PATCH",
    onSuccess: (res) => {
      toast.success(res.msg);
      localStorage.clear();
      redirect("/login");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleSubmitChangePassword = (e: any) => {
    console.log(e);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mt-8">Security & authentication</h2>
      <p className="font-semibold mt-2">Change password</p>
      <p>You will be required to login after changing your password.</p>
      <form onSubmit={handleSubmit(handleSubmitChangePassword)}>
        <label htmlFor="oldPassword" className="mt-5 mb-2">
          Current password
        </label>
        <PasswordInput
          inputClassName="border-[1px] border-black"
          register={register}
          fieldRules={{
            required: true,
            pattern: {
              value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
              message:
                "Minimum eight characters, at least one letter, one number and one special character",
            },
          }}
          errors={errors.oldPassword}
          fieldName="oldPassword"
        />
        <label htmlFor="newPassword" className="mt-5 mb-2">
          New Password
        </label>
        <PasswordInput
          fieldName="newPassword"
          inputClassName="border-[1px] border-black"
          register={register}
          fieldRules={{
            pattern: {
              value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
              message:
                "Minimum eight characters, at least one letter, one number and one special character",
            },
            validate: (val) => {
              const oldPassword = getValues("oldPassword");
              return (
                oldPassword !== val ||
                "Current Password and New Password cannot be equal"
              );
            },
          }}
          errors={errors.newPassword}
        />
        <label className="mt-5 mb-2" htmlFor="confirmNewPassword">
          Confirm New Password
        </label>
        <PasswordInput
          register={register}
          fieldRules={{
            required: true,
            validate: (match) => {
              const newPassword = getValues("newPassword");
              return match === newPassword || "New Password doesn't match";
            },
          }}
          inputClassName="border-[1px] border-black"
          fieldName="confirmNewPassword"
          errors={errors.confirmNewPassword}
        />
        <button
          className="px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-300 mt-6"
          type="submit"
          disabled={fetchState === "loading"}
        >
          {fetchState === "loading" ? (
            <ScaleLoader height={13} />
          ) : (
            "Change Password"
          )}
        </button>
      </form>
    </div>
  );
};

export default SecurityAndAuth;

import PasswordInput from "../Form/PasswordInput";
import { useFetch } from "../../hooks/useFetch";
import { base_url } from "../../utils/base_url";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import ScaleLoader from "react-spinners/ScaleLoader";
import { redirect, useNavigate } from "react-router-dom";

const SecurityAndAuth = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: { oldPassword: "", newPassword: "", confirmNewPassword: "" },
  });
  const navigate = useNavigate();

  const { fetchState, doFetch } = useFetch({
    url: base_url + "/user/change-password",
    authorized: true,
    method: "PATCH",
    onSuccess(res) {
      toast.success(res.msg);
      localStorage.clear();
      navigate("/login");
    },
    onError: (err) => {
      console.log(err);
      toast.error(err.message);
    },
  });

  return (
    <div>
      <h2 className="text-2xl font-semibold mt-8">Security & authentication</h2>
      <p className="font-semibold mt-2">Change password</p>
      <p>You will be required to login after changing your password.</p>
      <form
        onSubmit={handleSubmit(async (data) => {
          await doFetch(data);
        })}
      >
        <div className="mt-3">
          <label htmlFor="oldPassword">Current password</label>
          <PasswordInput
            inputClassName="border-[1px] border-black"
            register={register}
            placeholder="Enter current password"
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
        </div>
        <div className="mt-3">
          <label htmlFor="newPassword">New Password</label>
          <PasswordInput
            fieldName="newPassword"
            inputClassName="border-[1px] border-black"
            register={register}
            placeholder="Enter new password"
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
        </div>
        <div className="mt-3">
          <label className="mt-5 mb-2" htmlFor="confirmNewPassword">
            Confirm New Password
          </label>
          <PasswordInput
            register={register}
            placeholder="Confirm new password"
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
        </div>
        <button
          className="px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-300 mt-6 disabled:cursor-not-allowed"
          type="submit"
          disabled={fetchState === "loading" || !isDirty}
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

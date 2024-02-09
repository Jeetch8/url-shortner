interface IUserInfo {
  name: string;
  email: string;
  profile_img: string | Blob;
}

import React from "react";
import { useFetch } from "../../hooks/useFetch";
import { base_url } from "../../utils/base_url";
import toast from "react-hot-toast";
import { blobToFile } from "../../utils/url_to_blob_converter";
import { useUserContext } from "@/context/UserContext";
import { useForm } from "react-hook-form";
import HookFormInput from "../Form/HookFormInput";
import { emailRegex } from "@/utils/RegExp";
import { BeatLoader } from "react-spinners";

const Profile = () => {
  const { user, userFetchState } = useUserContext();
  if (userFetchState == "loading") {
    return <BeatLoader color="black" role="loader" />;
  }
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<IUserInfo>({
    defaultValues: {
      name: user?.user.name,
      profile_img: user?.user.profile_img,
      email: user?.user.email,
    },
  });
  const { doFetch: updateProfileQuery } = useFetch({
    url: base_url + "/user",
    method: "PUT",
    authorized: true,
    onSuccess: (res) => {
      toast.success("Profile updated");
      reset({ ...res?.user });
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.item(0);
    if (file) {
      setValue("profile_img", URL.createObjectURL(file), { shouldDirty: true });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Profile</h1>
      <form
        onSubmit={handleSubmit(async (data) => {
          const temp = { ...data };
          if (temp.profile_img.toString().startsWith("blob:"))
            temp.profile_img = blobToFile(temp.profile_img as Blob, temp.name);
          const formData = new FormData();
          formData.append("img", temp.profile_img);
          formData.append("name", temp.name);
          formData.append("email", temp.email);
          await updateProfileQuery(formData);
        })}
      >
        <div className="flex items-baseline gap-x-4 mt-4">
          <p>Profile image</p>
          <div className="border-4 border-gray-200 rounded-full p-1">
            <div
              role="avatar"
              style={{
                backgroundImage: `url(${watch("profile_img")})`,
                backgroundPosition: "center",
                backgroundSize: 100,
                backgroundRepeat: "no-repeat",
                borderRadius: "100%",
                width: "100px",
                height: "100px",
              }}
            ></div>
          </div>
          <label
            htmlFor="profile_img"
            className="border-[1px] px-4 rounded-md py-2 cursor-pointer border-white h-[42px] disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-300"
            role="button"
          >
            Change image
          </label>
          <input
            className="hidden border-[1px] border-black rounded-md px-2 py-1 outline-none"
            type="file"
            id="profile_img"
            {...register("profile_img")}
            accept="image/png, image/jpeg, image/jpg, image/avif"
            onChange={handleImageChange}
          />
        </div>
        <div className="flex items-baseline gap-x-4 mt-4">
          <p>Name</p>
          <HookFormInput
            register={register}
            fieldName="name"
            errors={errors.name}
            placeholder="Name"
            inputClassName="border-[1px] outline-none border-black rounded-md px-2 py-1"
          />
        </div>
        <div className="flex items-baseline gap-x-4 mt-4">
          <p>Email</p>
          <HookFormInput
            register={register}
            fieldName="email"
            fieldRules={{
              required: {
                value: true,
                message: "Email is required",
              },
              pattern: {
                value: emailRegex,
                message: "Email is not valid",
              },
            }}
            errors={errors.email}
            inputClassName="border-[1px] outline-none border-black rounded-md px-2 py-1"
            placeholder="Email"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-1 rounded-md mt-4 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-300"
          disabled={!isDirty}
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default Profile;

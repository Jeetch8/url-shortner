import React, { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { base_url } from "../utils/base_url";
import { urlToBlobConverter } from "../utils/url_to_blob_converter";
import { toast } from "react-hot-toast";

const Profile = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    profile_img: "",
  });
  const { doFetch, dataRef, fetchState } = useFetch({
    url: base_url + "/user/me",
    method: "GET",
    authorized: true,
    onSuccess: (res) => {
      const user = res?.user;
      setUserInfo({ ...user });
    },
  });
  const { doFetch: updateProfileQuery, fetchState: updateProfileState } =
    useFetch({
      url: base_url + "/user",
      method: "PUT",
      authorized: true,
      onSuccess: (res) => {
        toast.success("Profile updated");
        const user = res?.user;
        setUserInfo({ ...res?.user });
      },
    });

  useEffect(() => {
    doFetch();
  }, []);

  const handleUpdateUserProfile = () => {
    const temp = {};
    const intialUser = dataRef.current?.user;
    if (userInfo.email !== intialUser?.email) temp.email = userInfo.email;
    if (userInfo.name !== intialUser?.name) temp.name = userInfo.name;
    if (userInfo.profile_img !== intialUser?.profile_img)
      temp.profile_img = userInfo.profile_img;
    updateProfileQuery(temp);
  };

  const handleFieldChange = (e) => {
    setUserInfo((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleImageChange = async (e) => {
    const blob = await urlToBlobConverter(e.target.files[0]);
    setUserInfo((prev) => {
      return { ...prev, profile_img: blob };
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold">Profile</h1>
      <div className="flex items-baseline gap-x-4 mt-4">
        <p>Profile image</p>
        <label
          htmlFor=""
          style={{
            backgroundImage: `url(${userInfo.profile_img})`,
            backgroundPosition: "center",
            backgroundSize: 100,
            backgroundRepeat: "no-repeat",
            borderRadius: "100%",
            width: "100px",
            height: "100px",
          }}
        ></label>
        <input
          className=" border-[1px] border-black rounded-md px-2 py-1 outline-none"
          type="file"
          accept="image/png, image/gif, image/jpeg"
          onChange={handleImageChange}
          name="profile_img"
        />
      </div>
      <div className="flex items-baseline gap-x-4 mt-4">
        <p>Name</p>
        <input
          className=" border-[1px] border-black rounded-md px-2 py-1 outline-none"
          type="text"
          value={userInfo.name}
          name="name"
          onChange={handleFieldChange}
        />
      </div>
      <div className="flex items-baseline gap-x-4 mt-4">
        <p>Email</p>
        <input
          className="border-[1px] outline-none border-black rounded-md px-2 py-1"
          type="text"
          name="email"
          value={userInfo.email}
          onChange={handleFieldChange}
        />
      </div>
      <button
        onClick={handleUpdateUserProfile}
        className="border-[1px] border-black px-6 py-2 rounded-md mt-4"
      >
        Save
      </button>
    </div>
  );
};

export default Profile;

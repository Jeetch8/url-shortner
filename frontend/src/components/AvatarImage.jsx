import React from "react";

const AvatarImage = ({ url, diameter }) => {
  return (
    <div
      style={{
        width: diameter,
        height: diameter,
        backgroundPosition: "center",
        backgroundSize: "cover",
        overflow: "hidden",
        borderRadius: "100%",
        backgroundImage:
          `url(${url})` ??
          "https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small_2x/user-profile-icon-free-vector.jpg",
      }}
    ></div>
  );
};

export default AvatarImage;

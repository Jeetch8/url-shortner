const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const User = require("../models/user.model");
const cloudinary = require("cloudinary");
const fs = require("fs");

const getAllUserGeneratedLinks = async (req, res) => {
  const { userId } = req.user;
  const dbUser = await User.findById(userId).populate("generated_links");
  if (!dbUser) throw new UnauthenticatedError("User is not registered");
  return res
    .status(StatusCodes.OK)
    .json({ generated_links: dbUser.generated_links });
};

const getMyProfile = async (req, res) => {
  const userId = req.user.userId;
  const user = await User.findById(userId).select("name email profile_img");
  return res.status(200).json({ user });
};

const updateUserProfile = async (req, res) => {
  const userId = req.user?.userId;
  const userUpdateObj = req.body;
  console.log(req.files);
  if (req?.files?.image) {
    const result = await cloudinary.v2.uploader.upload(
      req.files.image.tempFilePath,
      {
        use_filename: true,
        folder: "file-upload",
      }
    );
    fs.unlinkSync(req.files.image.tempFilePath);
    console.log(result.secure_url);
    userUpdateObj["profile_img"] = result.secure_url;
  }
  console.log(userUpdateObj);
  const user = await User.findByIdAndUpdate(
    userId,
    { ...userUpdateObj },
    { new: true }
  ).select("name email profile_img");
  return res.status(200).json({ user });
};

module.exports = {
  getAllUserGeneratedLinks,
  getMyProfile,
  updateUserProfile,
};

const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const User = require("../models/user.model");

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
  if (userUpdateObj === undefined || JSON.stringify(userUpdateObj) === "{}")
    throw new BadRequestError("");
  const user = await User.findByIdAndUpdate(
    userId,
    { ...userUpdateObj },
    { new: true }
  ).select("name email profile_img");
  return res.status(200).json({ user });
};

module.exports = { getAllUserGeneratedLinks, getMyProfile, updateUserProfile };

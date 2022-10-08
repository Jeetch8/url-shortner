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

module.exports = { getAllUserGeneratedLinks };

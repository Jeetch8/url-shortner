const User = require("../models/user.model");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { createTokenUser } = require("../utils/createTokenUser");
const { createJWT } = require("../utils/jwt");

const register = async (req, res) => {
  const { email, name, password, profile_img } = req.body;
  const emailAlreadyExists = await User.findOne({ email: email.toLowerCase() });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError("Email already exists");
  }
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    profile_img:
      profile_img ??
      "https://res.cloudinary.com/testingcloud11/image/upload/v1715438271/file-upload/rnno9ono6n9q4hesjjt4.jpg",
  });
  const tokenUser = createTokenUser(user);
  const token = createJWT({ payload: tokenUser });
  res.status(StatusCodes.CREATED).json({ user: tokenUser, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new CustomError.UnauthenticatedError("Email not found");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Password Incorrect");
  }
  const tokenUser = createTokenUser(user);
  const token = createJWT({ payload: tokenUser });
  res.status(StatusCodes.OK).json({
    user: tokenUser,
    token,
  });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

const requestForPasswordResetToken = async (req, res) => {
  const { email } = req.body;
  if (!email || email === "" || typeof email === "undefined")
    throw new CustomError.BadRequestError("Email provided is not valid");
  const emailExist = await User.findOne({ email });
  if (!emailExist) throw new CustomError.NotFoundError("Email not found");
  const tokenUser = createTokenUser(emailExist);
  const resetToken = createJWT({ payload: tokenUser });
  await emailExist.save({ validateBeforeSave: false });
  res.status(StatusCodes.OK).json({ resetToken });
};

const changePassword = async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  if (newPassword !== confirmPassword)
    throw new CustomError.BadRequestError("Passwords do not match");
  const user = await User.findById(req.user.userId);
  if (!user) throw new CustomError.NotFoundError("User not found");
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Password updated successfully" });
};

module.exports = {
  register,
  login,
  logout,
  requestForPasswordResetToken,
  changePassword,
};

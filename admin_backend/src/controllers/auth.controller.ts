import { Request, Response } from "express";
import User from "@/models/user.model";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "@shared/utils/CustomErrors";
import { createTokenUser } from "@/utils/createTokenUser";
import { createJWT } from "@/utils/jwt";

export const register = async (req: Request, res: Response) => {
  const { email, name, password, profile_img } = req.body;
  const emailAlreadyExists = await User.findOne({ email: email.toLowerCase() });
  if (emailAlreadyExists) {
    throw new BadRequestError("Email already exists");
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

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new BadRequestError("Email not found");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new BadRequestError("Password Incorrect");
  }
  const tokenUser = createTokenUser(user);
  const token = createJWT({ payload: tokenUser });
  res.status(StatusCodes.OK).json({
    user: tokenUser,
    token,
  });
};

export const logout = async (req: Request, res: Response) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

export const requestForPasswordResetToken = async (
  req: Request,
  res: Response
) => {
  const { email } = req.body;
  if (!email || email === "" || typeof email === "undefined")
    throw new BadRequestError("Email provided is not valid");
  const emailExist = await User.findOne({ email });
  if (!emailExist) throw new BadRequestError("Email not found");
  const tokenUser = createTokenUser(emailExist);
  const resetToken = createJWT({ payload: tokenUser });
  await emailExist.save({ validateBeforeSave: false });
  res.status(StatusCodes.OK).json({ resetToken });
};

export const changePassword = async (req: Request, res: Response) => {
  const { newPassword, confirmPassword } = req.body;
  if (newPassword !== confirmPassword)
    throw new BadRequestError("Passwords do not match");
  const user = await User.findById(req?.user?.userId);
  if (!user) throw new NotFoundError("User not found");
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Password updated successfully" });
};

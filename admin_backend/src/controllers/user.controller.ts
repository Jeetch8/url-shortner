import { Request, Response } from "express";

import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} from "@shared/utils/CustomErrors";
import User from "../models/user.model";
import cloudinary from "cloudinary";
import dayjs from "dayjs";
import { isCuid } from "@paralleldrive/cuid2";
import fs from "fs";
import { IChartsData } from "@/types/controllers/dashboard";

export const getAllUserGeneratedLinks = async (req: Request, res: Response) => {
  const userId = req?.user?.userId;
  const dbUser = await User.findById(userId).populate({
    path: "generated_links",
    populate: {
      path: "stats",
      select: { clicker_info: 0, _id: 0, createdAt: 0, updatedAt: 0, __v: 0 },
    },
    select: {
      password: 0,
      creator_id: 0,
      __v: 0,
    },
  });
  if (!dbUser) throw new UnauthorizedError("User not found");
  const favoritesSet = new Set(dbUser.favorites.map((el) => el.toString()));
  const generated_links = dbUser.generated_links.map((el) => ({
    ...el,
    favorite: favoritesSet.has(el._id.toString()),
  }));
  return res.status(StatusCodes.OK).json({ generated_links: generated_links });
};

export const getMyProfile = async (req: Request, res: Response) => {
  const userId = req?.user?.userId;
  const user = await User.findById(userId).select("name email profile_img");
  return res.status(200).json({ user });
};

const isWithinLastSevenDays = (dateTime: string) => {
  const sevenDaysAgo = dayjs().subtract(7, "day");
  const providedDateTime = dayjs(dateTime);

  return providedDateTime.isAfter(sevenDaysAgo);
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const userUpdateObj = req.body;
  const userProfileImg: any = req?.files?.image;
  if (userProfileImg) {
    const result = await cloudinary.v2.uploader.upload(
      userProfileImg.tempFilePath,
      {
        use_filename: true,
        folder: "url_shortner",
      }
    );
    fs.unlinkSync(userProfileImg.tempFilePath);
    userUpdateObj["profile_img"] = result.secure_url;
  }
  const user = await User.findByIdAndUpdate(
    userId,
    { ...userUpdateObj },
    { new: true }
  ).select("name email profile_img");
  return res.status(200).json({ user });
};

export const getUserOverallStats = async (req: Request, res: Response) => {
  const userId = req?.user?.userId;
  const user = await User.findById(userId).populate({
    path: "generated_links",
    populate: { path: "stats" },
  });
  if (!user) throw new UnauthorizedError("User not found");
  const dateBefore7Days = dayjs(new Date()).subtract(6, "days");
  const generatedLinksArrLen = user.generated_links.length;
  const clicks_last7days: { [key: string]: number } = {};
  const referrer_last7days: { [key: string]: number } = {};
  const browser_lastt7days: { [key: string]: number } = {};
  const location_last7days: { [key: string]: number } = {};
  const devices_last7days: { [key: string]: number } = {};
  let total_clicks = 0;
  for (let i = 0; i < 7; i++) {
    const date = dateBefore7Days.add(i, "day").format("DD-MM");
    clicks_last7days[date] = 0;
  }
  for (let i = 0; i < generatedLinksArrLen; i++) {
    const link = user.generated_links[i] as unknown as any;
    const clickerInfoArrLen = link.stats.clicker_info.length - 1;
    total_clicks += clickerInfoArrLen + 1;
    // For omtimzation
    // let lastInfoDate = dayjs(
    //   link.stats.clicker_info[clickerInfoArrLen].createdAt
    // ).format("DD-MM");
    for (let j = clickerInfoArrLen; j >= 0; j--) {
      const stats = link.stats as any;
      const info = stats.clicker_info[j];
      const createdDate = info.createdAt;
      if (isWithinLastSevenDays(createdDate)) {
        const entityDate = dayjs(createdDate).format("DD-MM");
        clicks_last7days[entityDate] += 1;

        const referrer = info.referrer;
        if (referrer_last7days[referrer]) referrer_last7days[referrer] += 1;
        else referrer_last7days[referrer] = 1;

        if (browser_lastt7days[info.browser]) {
          browser_lastt7days[info.browser] += 1;
        } else browser_lastt7days[info.browser] = 1;

        const country = info.location.country;
        if (location_last7days[country]) {
          location_last7days[country] += 1;
        } else location_last7days[country] = 1;

        if (devices_last7days[info.device]) {
          devices_last7days[info.device] += 1;
        } else devices_last7days[info.device] = 1;
      }
    }
  }
  const location = [];
  for (const key in location_last7days) {
    location.push({ country: key, value: location_last7days[key] });
  }
  const clicks: IChartsData & { borderColor: string } = {
    label: [],
    data: [],
    borderColor: "red",
  };
  let total_clicks_last7days = 0;
  for (const key in clicks_last7days) {
    clicks.label.push(key);
    clicks.data.push(clicks_last7days[key]);
    total_clicks_last7days += clicks_last7days[key];
  }
  const referrer = [];
  for (const key in referrer_last7days) {
    referrer.push({ label: key, value: referrer_last7days[key] });
  }
  const devices = [];
  for (const key in devices_last7days) {
    devices.push({ label: key, value: devices_last7days[key] });
  }
  clicks.borderColor = getClicksChartColor(clicks);
  const resObj = {
    total_clicks,
    generated_links: user.generated_links.length,
    clicks: clicks,
    clicks_last7days: total_clicks_last7days,
    referrer,
    browser: browser_lastt7days,
    location,
    devices,
  };

  res.status(200).json(resObj);
};

function getClicksChartColor(data: IChartsData & { borderColor: string }) {
  if (data.data.length === 0) return "red";
  if (data.data.length === 1) return "green";
  let max = data.data[0];
  const last = data.data[data.data.length - 1];
  for (let i = 0; i < data.data.length; i++) {
    if (data.data[i] > max) max = data.data[i];
  }
  if (max <= last) return "green";
  return "red";
}

export const updatePassword = async (req: Request, res: Response) => {
  const userId = req?.user?.userId;
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || oldPassword === "" || newPassword || newPassword === "")
    throw new BadRequestError("Expected fields were empty");
  const user = await User.findById(userId);
  if (!user) throw new ForbiddenError("User not found");
  const isOldPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isOldPasswordCorrect)
    throw new BadRequestError("Old Password is incorrect");
  const updatingPassword = await User.findByIdAndUpdate(userId, {
    password: newPassword,
  });
  if (!updatingPassword) throw new BadRequestError("Something went wrong");
  return res.status(200).json({ msg: "Password updated" });
};

export const toogleFavoriteUrls = async (req: Request, res: Response) => {
  const userId = req?.user?.userId;
  const { shortendUrlId } = req.body;
  if (!isCuid(shortendUrlId)) {
    throw new BadRequestError("Provided id is not valid");
  }
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError("User not found");
  let isFavorite = user.favorites.includes(shortendUrlId);
  if (!isFavorite) {
    await User.findByIdAndUpdate(userId, {
      $push: { favorites: shortendUrlId },
    });
    return res.status(200).json({ msg: "Added to favorites", favorite: true });
  } else {
    await User.findByIdAndUpdate(userId, {
      $pull: { favorites: shortendUrlId },
    });
    return res
      .status(200)
      .json({ msg: "Removed from favorites", favorite: false });
  }
};

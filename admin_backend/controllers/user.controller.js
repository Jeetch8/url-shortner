const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const User = require("../models/user.model");
const cloudinary = require("cloudinary");
const fs = require("fs");
const dayjs = require("dayjs");

const getAllUserGeneratedLinks = async (req, res) => {
  const { userId } = req.user;
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

const isWithinLastSevenDays = (dateTime) => {
  const sevenDaysAgo = dayjs().subtract(7, "day");
  const providedDateTime = dayjs(dateTime);

  return providedDateTime.isAfter(sevenDaysAgo);
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

const getUserOverallStats = async (req, res) => {
  const userId = req.user.userId;
  const user = await User.findById(userId).populate({
    path: "generated_links",
    populate: "stats",
  });
  const dateBefore7Days = dayjs(new Date()).subtract(6, "days");
  const generatedLinksArrLen = user.generated_links.length;
  const clicks_last7days = {};
  const referrer_last7days = {};
  const browser_lastt7days = {};
  const location_last7days = {};
  const devices_last7days = {};
  let total_clicks = 0;
  for (let i = 0; i < 7; i++) {
    const date = dateBefore7Days.add(i, "day").format("DD-MM");
    clicks_last7days[date] = 0;
  }
  for (let i = 0; i < generatedLinksArrLen; i++) {
    const link = user.generated_links[i];
    const clickerInfoArrLen = link.stats.clicker_info.length - 1;
    total_clicks += clickerInfoArrLen + 1;
    // For omtimzation
    // let lastInfoDate = dayjs(
    //   link.stats.clicker_info[clickerInfoArrLen].createdAt
    // ).format("DD-MM");
    for (let j = clickerInfoArrLen; j >= 0; j--) {
      const info = link.stats.clicker_info[j];
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
  const clicks = {
    labels: [],
    data: [],
  };
  let total_clicks_last7days = 0;
  for (const key in clicks_last7days) {
    clicks.labels.push(key);
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

function getClicksChartColor(data) {
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

module.exports = {
  getAllUserGeneratedLinks,
  getMyProfile,
  getUserOverallStats,
  updateUserProfile,
};

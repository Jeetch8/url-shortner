const { StatusCodes } = require("http-status-codes");
const StatsModel = require("../models/stats.model");
const Shortend_url_model = require("../models/shortend_url.model");
const {
  NotFoundError,
  UnauthenticatedError,
} = require("../../url_retriever_backend/errors");

const getShortendLinkStats = async (req, res) => {
  const shortend_link_id = req.params.id;
  const userId = req.user.userId;
  const shortend_url_obj = await Shortend_url_model.findOne({
    shortened_url_cuid: shortend_link_id,
  });
  if (!shortend_url_obj) throw new NotFoundError("Shortned link not found");
  if (shortend_url_obj.creator_id !== userId)
    throw new UnauthenticatedError(
      "Not authorized access stats of the requested shortend url"
    );
  const link_stats = await StatsModel.findOne({
    shortend_url_id: shortend_url_obj._id,
  });
  const clickers_info_arr = link_stats.clicker_info;
  const stats = {
    referrer: {
      label: [],
      data: [],
    },
    platform: {
      label: [],
      data: [],
    },
    browser: {
      label: [],
      data: [],
    },
    location: {
      label: [],
      data: [],
    },
  };
  const obj = {
    referrer: {},
    browser: {},
    platform: {},
    location: {},
  };
  const logs = [];
  let prevCurrentInd = clickers_info_arr.length - 1;
  clickers_info_arr.forEach((el) => {
    const dateCl = new Date(el.createdAt);
    const date = `${dateCl.getDate()}/${dateCl.getMonth()}/${dateCl.getFullYear()}`;
    const time = `${dateCl.getMinutes()}:${dateCl.getHours()}:${dateCl.getSeconds()}`;
    logs[prevCurrentInd] = {
      browser: el.browser,
      platform: el.platform,
      referrer: el.referrer,
      location: el.location,
      date: { date, time },
    };
    prevCurrentInd--;

    const referrer_ind = obj.referrer[el.referrer];
    if (referrer_ind >= 0) {
      stats.referrer.data[referrer_ind]++;
    } else {
      stats.referrer.label.push(el.referrer);
      stats.referrer.data.push(1);
      obj.referrer[el.referrer] = stats.referrer.data.length - 1;
    }

    const platform_ind = obj.platform[el.platform];
    if (platform_ind >= 0) {
      stats.platform.data[platform_ind]++;
    } else {
      stats.platform.label.push(el.platform);
      stats.platform.data.push(1);
      obj.platform[el.platform] = stats.referrer.data.length - 1;
    }

    const browser_ind = obj.browser[el.browser];
    if (browser_ind >= 0) {
      stats.browser.data[browser_ind]++;
    } else {
      stats.browser.label.push(el.browser);
      stats.browser.data.push(1);
      obj.browser[el.browser] = stats.referrer.data.length - 1;
    }

    const location_ind = obj.location[el.location.country];
    if (location_ind >= 0) {
      stats.location.data[location_ind]++;
    } else {
      stats.location.label.push(el.location.country);
      stats.location.data.push(1);
      obj.location[el.location.country] = stats.referrer.data.length - 1;
    }
  });

  return res.status(StatusCodes.OK).json({ stats, logs });
};

module.exports = { getShortendLinkStats };

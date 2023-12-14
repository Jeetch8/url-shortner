import { StatusCodes } from "http-status-codes";
import {
  ShortendUrlDocumentType,
  ShortendUrlModel,
} from "@shared/models/shortend_url.model";
import { NotFoundError, ForbiddenError } from "@shared/utils/CustomErrors";
import dayjs from "dayjs";
import {
  getLast12MonthsObj,
  getLast24HrObj,
  getLast30DaysObj,
} from "@/utils/dateAndTime";
import { Request, Response } from "express";
import { IStats, ITempObject } from "@/types/controllers/dashboard";
import mongoose from "mongoose";
import { ShortendUrlWithStats } from "./types";

export class DashboardController {
  public async getShortendLinkStats(req: Request, res: Response) {
    const shortend_link_id = req.params.id;
    const userId = req?.user?.userId;
    const shortend_url_arr: ShortendUrlWithStats[] =
      await ShortendUrlModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(shortend_link_id),
          },
        },
        {
          $lookup: {
            from: "stats",
            localField: "stats",
            foreignField: "_id",
            as: "stats",
          },
        },
        {
          $project: {
            "protected.password": 0,
          },
        },
      ]);
    if (shortend_url_arr?.length === 0)
      throw new NotFoundError("Shortned link not found");
    const shortend_url_obj = shortend_url_arr[0];
    if (shortend_url_obj.creator_id !== userId)
      throw new ForbiddenError(
        "Not authorized access stats of the requested shortend url"
      );
    const link_stats = shortend_url_obj.stats;
    const clickers_info_arr = link_stats.clicker_info;
    const todaysDate = dayjs(new Date());
    const last30DaysObj = getLast30DaysObj(todaysDate);
    const last12Months = getLast12MonthsObj(todaysDate);
    const last24Hours = getLast24HrObj(todaysDate);
    const stats: IStats = {
      totalClicks: link_stats.total_clicks,
      clicksType: {
        label: ["Unique", "Non-Unique"],
        data: [0, 0],
      },
      topDays: {
        label: [],
        data: [],
      },
      topHours: {
        label: [],
        data: [],
      },
      clicksByDays: {
        label: last30DaysObj.arr,
        data: new Array(30).fill(0),
      },
      clicksByMonths: {
        label: last12Months.arr,
        data: new Array(12).fill(0),
      },
      clicksByHours: {
        label: last24Hours.arr,
        data: new Array(24).fill(0),
      },
      devices: {
        label: ["Mobile", "Tablet", "Desktop", "others"],
        data: [0, 0, 0, 0],
      },
      referrer: {
        label: [],
        data: [],
      },
      platform: {
        label: [],
        data: [],
      },
      browser: {
        label: ["Chrome", "Firefox", "Mozilla", "Others"],
        data: [0, 0, 0, 0],
      },
      location: [],
    };
    const obj: ITempObject = {
      referrer: {},
      platform: {},
      location: {},
      clicks_ip: {},
      topDays: {
        Sunday: 0,
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        Saturday: 0,
      },
      topHours: {
        "1 AM": 0,
        "2 AM": 0,
        "3 AM": 0,
        "4 AM": 0,
        "5 AM": 0,
        "6 AM": 0,
        "7 AM": 0,
        "8 AM": 0,
        "9 AM": 0,
        "10 AM": 0,
        "11 AM": 0,
        "12 AM": 0,
        "1 PM": 0,
        "2 PM": 0,
        "3 PM": 0,
        "4 PM": 0,
        "5 PM": 0,
        "6 PM": 0,
        "7 PM": 0,
        "8 PM": 0,
        "9 PM": 0,
        "10 PM": 0,
        "11 PM": 0,
        "12 PM": 0,
      },
    };
    const logs: {
      browser: string;
      platform: string;
      referrer: string;
      location: { country: string; city: string };
      date: { elDate: string; elTime: string };
    }[] = [];
    if (clickers_info_arr.length === 0 && link_stats.total_clicks === 0)
      return res
        .status(200)
        .json({ stats, logs, shortend_url: shortend_url_obj });
    const tempDate = clickers_info_arr[clickers_info_arr.length - 1]?.createdAt;
    const prevDateAndTime = {
      stringDate: tempDate,
      dayjsDate: dayjs(tempDate),
    };
    let logsCurrentInd = 0;
    for (let i = clickers_info_arr.length - 1; i >= 0; i--) {
      const el = clickers_info_arr[i];
      const dateCl =
        prevDateAndTime.stringDate === el.createdAt
          ? prevDateAndTime.dayjsDate
          : dayjs(el.createdAt);
      if (prevDateAndTime.stringDate !== el.createdAt) {
        prevDateAndTime.dayjsDate = dateCl;
        prevDateAndTime.stringDate = el.createdAt;
      }
      const elDate = dateCl.format("DD/MM/YYYY");
      const elTime = dateCl.format("HH:mm:ss");
      logs[logsCurrentInd] = {
        browser: el.browser,
        platform: el.platform,
        referrer: el.referrer,
        location: el.location,
        date: { elDate, elTime },
      };
      logsCurrentInd++;

      const ipExistInObj = obj.clicks_ip[el.ip_address];
      if (ipExistInObj === undefined) {
        obj.clicks_ip[el.ip_address] = 1;
        stats.clicksType.data[0] += 1;
      } else {
        if (ipExistInObj === 1) {
          stats.clicksType.data[0] -= 1;
          stats.clicksType.data[1] += 2;
        } else {
          stats.clicksType.data[1] += 1;
        }
        obj.clicks_ip[el.ip_address] += 1;
      }

      obj.topDays[dateCl.format("dddd")]++;
      obj.topHours[dateCl.format("h A")]++;

      const tempHoursInd = last24Hours.obj[dateCl.format("DD/MM/YYYY hh:00 A")];
      if (tempHoursInd !== undefined) {
        stats.clicksByHours.data[tempHoursInd]++;
      }

      const tempMonthInd = last12Months.obj[dateCl.format("MMMM YYYY")];
      if (tempMonthInd !== undefined) {
        stats.clicksByMonths.data[tempMonthInd]++;
      }

      const tempDayInd = last30DaysObj.obj[elDate];
      if (tempDayInd !== undefined) {
        stats.clicksByDays.data[tempDayInd]++;
      }

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
        obj.platform[el.platform] = stats.platform.data.length - 1;
      }

      const elBrowser = el.browser;
      if (elBrowser === "Chrome") stats.browser.data[0] += 1;
      else if (elBrowser === "Firefox") stats.browser.data[1] += 1;
      else if (elBrowser === "Mozilla") stats.browser.data[2] += 1;
      else stats.browser.data[3] += 1;

      const elDevice = el.device;
      if (elDevice === "mobile") stats.devices.data[0] += 1;
      else if (elDevice === "tablet") stats.devices.data[1] += 1;
      else if (elDevice === undefined) stats.devices.data[2] += 1;
      else stats.devices.data[3] += 1;

      const location_ind = obj.location[el.location.country];
      if (location_ind !== undefined) {
        stats.location[location_ind].value += 1;
      } else {
        const countryName = el.location.country;
        obj.location[countryName] = stats.location.length;
        stats.location.push({ country: countryName, value: 1 });
      }
    }
    for (let key in obj.topDays) {
      const temp = (obj.topDays[key] / link_stats.total_clicks) * 100;
      stats.topDays.label.push(key);
      stats.topDays.data.push(Number(temp.toFixed(2)) ?? 0);
    }
    for (let key in obj.topHours) {
      const temp = (obj.topHours[key] / link_stats.total_clicks) * 100;
      stats.topHours.label.push(key);
      stats.topHours.data.push(Number(temp.toFixed(2)) ?? 0);
    }
    for (let i = 0; i < stats.browser.data.length; i++) {
      const temp = (stats.browser.data[i] / stats.totalClicks) * 100;
      stats.browser.data[i] = Number(temp.toFixed(2));
    }
    stats.clicksType.data.forEach((el, ind) => {
      const temp = (el / stats.totalClicks) * 100;
      stats.clicksType.data[ind] = Number(temp.toFixed(2));
    });
    return res
      .status(StatusCodes.OK)
      .json({ stats, logs, shortend_url: shortend_url_obj });
  }
}

require("dotenv").config();
require("express-async-errors");

const express = require("express");

const app = express();
const mongoose = require("mongoose");
const { isCuid } = require("@paralleldrive/cuid2");
const { ShortendUrlModel } = require("../shared/models/shortend_url.model");
const { StatsModel } = require("../shared/models/stats.model");
const { BadRequestError, NotFoundError } = require("./errors");
const requestIp = require("request-ip");
const uap = require("ua-parser-js");
const morgan = require("morgan");
const geoip = require("geoip-lite");
const ejs = require("ejs");
const { isbot } = require("isbot");

app.set("view engine", "ejs");
app.set("trust proxy", true);
app.use(morgan("dev"));

app.get("/verify-password/:shortCode", async (req, res) => {
  const { password } = req.query;
  const shortCode = req.params.shortCode;
  const obj = await ShortendUrlModel.findOne({
    shortened_url_cuid: shortCode,
  });
  if (!obj || JSON.stringify(obj) === "{}")
    throw new NotFoundError("Page not found, please check your shortend link");
  const isMatch = await obj.comparePassword(password);
  if (isMatch) {
    await registerUserClick(req, obj._id);
    return res.status(200).json({ url: obj.original_url });
  } else {
    return res.status(400).json({ msg: "Invalid password" });
  }
});

app.get("/:id", async (req, res) => {
  const cuid = req.params?.id;
  if (!cuid || cuid === "" || !isCuid(cuid))
    throw new BadRequestError("Invalid link");
  const obj = await ShortendUrlModel.findOne({ shortened_url_cuid: cuid });
  if (
    !obj ||
    JSON.stringify(obj) === "{}" ||
    !obj.shortened_url_cuid ||
    !obj.original_url
  )
    throw new NotFoundError("Page not found, please check your shortend link");
  if (obj.protected.enabled)
    return res.render("password-prompt", { shortCode: cuid });
  await registerUserClick(req, obj._id);
  const isUserBot = isbot(req.get["user-agent"]);
  if (isUserBot) {
    return res.render("preview", {
      image: obj.sharing_preview.image,
      title: obj.sharing_preview.title,
      description: obj.sharing_preview.description,
    });
  }
  if (obj.link_cloaking) return res.render("index", { url: obj.original_url });
  else return res.redirect(obj.original_url);
});

const registerUserClick = async (req, shortend_url_id) => {
  const clientIp = requestIp.getClientIp(req);
  const ua = uap(req.headers["user-agent"]);
  const referrer = req.get("Referrer");
  const geo = geoip.lookup(clientIp); //223.233.80.198
  const clicker_info = {
    ip_address: clientIp,
    browser: ua.browser.name ?? "unknown",
    device: ua.device.type ?? "unknown",
    referrer: referrer ?? "direct",
    platform: ua.engine.name ?? "unknown",
    location: {
      country: geo?.country ?? "unknown",
      city: geo?.city ?? "unknown",
    },
  };
  await StatsModel.findOneAndUpdate(
    { shortend_url_id },
    {
      $inc: { total_clicks: 1 },
      $push: { clicker_info },
    }
  );
};

const serverInit = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_URL).then(() => {
      console.log("Mongo DB Connected");
    });
    app.listen(8000, () => {
      console.log("URL Retrieval Server Initialized on PORT 8000");
    });
  } catch (error) {
    console.log(error);
  }
};

serverInit();

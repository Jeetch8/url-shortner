require("dotenv").config();
require("express-async-errors");

const express = require("express");

const app = express();
const mongoose = require("mongoose");
const { isCuid } = require("@paralleldrive/cuid2");
const Shortend_url_model = require("./models/shortend_url.model");
const { BadRequestError } = require("./errors");

app.get("/:id", async (req, res) => {
  const cuid = req.params?.id;
  console.log(cuid, req.params, req.url);
  if (!cuid || cuid === "" || !isCuid(cuid))
    throw new BadRequestError("Invalid link");
  const obj = await Shortend_url_model.findOne({ shortened_url_cuid: cuid });
  if (
    !obj ||
    JSON.stringify(obj) === "{}" ||
    !obj.shortened_url_cuid ||
    !obj.original_url
  )
    throw new NotFoundError("Page not found, please check your shortend link");
  return res.redirect(obj.original_url);
});

const serverInit = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_URL).then(() => {
      console.log("Mongo DB Connected");
    });
    app.listen(8080, () => {
      console.log("URL Retrieval Server Initialized on PORT 8080");
    });
  } catch (error) {
    console.log(error);
  }
};

serverInit();

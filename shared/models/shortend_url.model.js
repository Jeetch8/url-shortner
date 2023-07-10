const mongoose = require("mongoose");

const shortend_url = new mongoose.Schema(
  {
    link_title: { type: String, required: true },
    title_description: { type: String },
    original_url: { type: String, required: true },
    shortened_url_cuid: { type: String, required: true },
    creator_id: { type: String, requierd: true, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("shortend_url", shortend_url);

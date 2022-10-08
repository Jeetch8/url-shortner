const mongoose = require("mongoose");

const shortend_url = mongoose.Schema(
  {
    original_url: { type: String, required: true },
    shortened_url_cuid: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("shortend_url", shortend_url);

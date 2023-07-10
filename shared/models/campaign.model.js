const mongoose = require("mongoose");

const ClikerInfoSchema = new mongoose.Schema(
  {
    ip_address: { type: String, required: true },
    platform: { type: String, required: true },
    device: { type: String, required: true },
    referrer: { type: String, required: true },
    browser: { type: String, required: true },
    location: {
      country: { type: String, required: true },
      city: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const CampaignSchema = new mongoose.Schema(
  {
    source: {
      type: String,
    },
    medium: {
      type: String,
    },
    campaign: {
      type: String,
    },
    campaign_term: {
      type: String,
    },
    campaign_term: {
      type: String,
    },
    total_clicks: {
      type: Number,
      default: 0,
    },
    clicker_info: [ClikerInfoSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Campaign", CampaignSchema);

import {
  StatDocument,
  StatModel as IStatModel,
  StatSchema,
} from "@shared/types/mongoose-types";
import mongoose from "mongoose";

const clickerInfoSchema = new mongoose.Schema(
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
  {
    timestamps: true,
    versionKey: false,
  }
);

const statSchema: StatSchema = new mongoose.Schema(
  {
    shortend_url_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShortendUrl",
      required: true,
    },
    total_clicks: { type: Number, default: 0, required: true },
    clicker_info: [clickerInfoSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const StatModel = mongoose.model<StatDocument, IStatModel>(
  "Stat",
  statSchema
);

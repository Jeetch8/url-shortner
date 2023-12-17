import {
  prop,
  getModelForClass,
  Ref,
  modelOptions,
  Severity,
} from "@typegoose/typegoose";
import { ShortendUrl } from "./shortend_url.model";
import { Schema } from "mongoose";

@modelOptions({
  schemaOptions: {
    timestamps: true, // Adds createdAt and updatedAt fields
    versionKey: false,
  },
})
class ClickerInfo {
  @prop({ required: true })
  public ip_address!: string;

  @prop({ required: true })
  public platform!: string;

  @prop({ required: true })
  public device!: string;

  @prop({ required: true })
  public referrer!: string;

  @prop({ required: true })
  public browser!: string;

  @prop({ required: true })
  public location!: {
    country: string;
    city: string;
  };
}

interface ClickerInfoDocumentType extends ClickerInfo {
  _id: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

class Stats {
  @prop({ ref: () => ShortendUrl, required: true })
  public shortend_url_id!: Ref<ShortendUrl>;

  @prop({ default: 0 })
  public total_clicks!: number;

  @prop({ type: () => [ClickerInfo], default: [] })
  public clicker_info!: ClickerInfo[];
}

interface StatsDocumentType extends Stats {
  _id: Schema.Types.ObjectId;
  clicker_info: ClickerInfoDocumentType[];
  createdAt: Date;
  updatedAt: Date;
}

const StatsModel = getModelForClass(Stats);

export { StatsModel, Stats, StatsDocumentType };

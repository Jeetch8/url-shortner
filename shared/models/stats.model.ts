import {
  prop,
  getModelForClass,
  Ref,
  modelOptions,
  Severity,
} from "@typegoose/typegoose";
import { ShortendUrl } from "@shared/models/shortend_url.model";

@modelOptions({
  options: {
    allowMixed: Severity.ALLOW, // Required for nested objects like 'location'
  },
  schemaOptions: {
    timestamps: true, // Adds createdAt and updatedAt fields
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

@modelOptions({
  schemaOptions: {
    timestamps: true, // Adds createdAt and updatedAt fields
  },
})
export class Stats {
  @prop({ ref: () => ShortendUrl, required: true })
  public shortend_url_id!: Ref<ShortendUrl>;

  @prop({ default: 0 })
  public total_clicks!: number;

  @prop({ type: () => [ClickerInfo], default: [] })
  public clicker_info!: ClickerInfo[];
}

const StatsModel = getModelForClass(Stats);

export default StatsModel;

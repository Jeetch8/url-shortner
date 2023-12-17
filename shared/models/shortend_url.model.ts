import {
  prop,
  getModelForClass,
  pre,
  Ref,
  modelOptions,
  Severity,
} from "@typegoose/typegoose";
import bcrypt from "bcryptjs";
import { Schema } from "mongoose";
import { Stats } from "./stats.model";

class SharingPreview {
  @prop()
  public title!: string;

  @prop()
  public description!: string;

  @prop()
  public image!: string;
}

class Protected {
  @prop({ default: false })
  public enabled!: boolean;

  @prop()
  public password?: string;
}

class LinkExpiry {
  @prop({ default: false })
  public enabled!: boolean;

  @prop()
  public link_expires_on!: string;

  @prop()
  public expiry_redirect_url!: string;
}

class Device {
  @prop()
  public ios!: string;

  @prop()
  public android!: string;

  @prop()
  public windows!: string;

  @prop()
  public linux!: string;

  @prop()
  public mac!: string;
}

class LinkTargetting {
  @prop({ default: false })
  public enabled!: boolean;

  @prop()
  public target!: string;

  @prop()
  public countries!: Schema.Types.Mixed;

  @prop()
  public device!: Device;

  @prop()
  public rotate!: string[];
}

@pre<ShortendUrl>("save", async function (next) {
  if (!this.isModified("protected.password")) return next();
  if (!this.protected?.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.protected.password = await bcrypt.hash(this.protected.password, salt);
  next();
})
@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },
  schemaOptions: {
    timestamps: true,
    versionKey: false,
  },
})
class ShortendUrl {
  @prop({ required: true })
  public link_title!: string;

  @prop({ default: false })
  public link_enabled!: boolean;

  @prop()
  public title_description!: string;

  @prop({ required: true })
  public original_url!: string;

  @prop({ required: true })
  public shortened_url_cuid!: string;

  @prop({ ref: () => "User" })
  public creator_id!: Ref<any>;

  @prop({ default: false })
  public link_cloaking!: boolean;

  @prop()
  public sharing_preview!: SharingPreview;

  @prop()
  public tags!: string[];

  @prop()
  public protected!: Protected;

  @prop()
  public link_expiry!: LinkExpiry;

  @prop()
  public link_targetting!: LinkTargetting;

  @prop({ ref: "stats" })
  public stats!: Ref<Stats>;

  public async comparePassword(candidatePassword: string): Promise<boolean> {
    if (!this.protected?.password) return false;
    const isMatch = await bcrypt.compare(
      candidatePassword,
      this.protected?.password
    );
    return isMatch;
  }
}

const ShortendUrlModel = getModelForClass(ShortendUrl);

interface ShortendUrlDocumentType extends ShortendUrl {
  _id: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export { ShortendUrlModel, ShortendUrl, ShortendUrlDocumentType };

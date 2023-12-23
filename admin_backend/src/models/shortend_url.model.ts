import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import {
  ShortendUrlDocument,
  ShortendUrlModel as IShortendUrlModel,
  ShortendUrlSchema,
} from "@shared/types/mongoose-types";

const shortendUrlSchema: ShortendUrlSchema = new mongoose.Schema(
  {
    link_title: { type: String, required: true },
    link_enabled: { type: Boolean, default: false, required: true },
    title_description: { type: String, required: true },
    original_url: { type: String, required: true },
    shortend_url_cuid: { type: String, required: true },
    creator_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    link_cloaking: { type: Boolean, default: false, required: true },
    sharing_preview: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      image: { type: String, required: true },
    },
    tags: [{ type: String }],
    protected: {
      enabled: { type: Boolean, default: false, required: true },
      password: { type: String },
    },
    link_expiry: {
      enabled: { type: Boolean, default: false, required: true },
      link_expires_on: { type: String },
      expiry_redirect_url: { type: String },
    },
    link_targetting: {
      enabled: { type: Boolean, default: false, required: true },
      target: { type: String },
      countries: mongoose.Schema.Types.Mixed,
      device: {
        ios: { type: String, required: true },
        android: { type: String, required: true },
        windows: { type: String, required: true },
        linux: { type: String, required: true },
        mac: { type: String, required: true },
      },
      rotate: [{ type: String }],
    },
    stats: { type: mongoose.Schema.Types.ObjectId, ref: "Stat" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

shortendUrlSchema.pre("save", async function (next) {
  if (!this.isModified("protected.password")) return next();
  if (!this.protected?.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.protected.password = await bcrypt.hash(this.protected.password, salt);
  next();
});

shortendUrlSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  if (!this.protected?.password) return false;
  return bcrypt.compare(candidatePassword, this.protected.password);
};

export const ShortendUrlModel = mongoose.model<
  ShortendUrlDocument,
  IShortendUrlModel
>("ShortendUrl", shortendUrlSchema);

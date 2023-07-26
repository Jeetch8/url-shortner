const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ShortendUrlSchema = new mongoose.Schema(
  {
    link_title: { type: String, required: true },
    link_enabled: {
      type: Boolean,
      default: false,
    },
    title_description: { type: String },
    original_url: { type: String, required: true },
    shortened_url_cuid: { type: String, required: true },
    creator_id: { type: String, requierd: true, ref: "User" },
    link_cloaking: { type: Boolean, default: false },
    sharing_preview: {
      title: { type: String },
      description: { type: String },
      image: { type: String },
    },
    tags: [{ type: String }],
    protected: {
      enabled: {
        default: false,
        type: Boolean,
      },
      password: {
        type: String,
      },
    },
    link_expiry: {
      enabled: {
        default: false,
        type: Boolean,
      },
      link_expires_on: {
        type: String,
      },
      expiry_redirect_url: {
        type: String,
      },
    },
    link_targetting: {
      enabled: {
        type: Boolean,
        default: false,
      },
      target: {
        type: String,
      },
      countries: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
      device: {
        ios: {
          type: String,
        },
        android: {
          type: String,
        },
        windows: {
          type: String,
        },
        linux: {
          type: String,
        },
        mac: {
          type: String,
        },
      },
      rotate: [{ type: String }],
    },
  },
  {
    timestamps: true,
    virtuals: {
      stats: {
        options: {
          ref: "Stats",
          localField: "_id",
          foreignField: "shortend_url_id",
          justOne: true,
        },
      },
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ShortendUrlSchema.pre("save", async function () {
  if (!this.isModified("protected.password")) return;
  if (this.protected.password === undefined) return;
  const salt = await bcrypt.genSalt(10);
  this.protected.password = await bcrypt.hash(this.protected.password, salt);
});

ShortendUrlSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(
    canditatePassword,
    this.protected.password
  );
  return isMatch;
};

module.exports = mongoose.model("shortend_url", ShortendUrlSchema);

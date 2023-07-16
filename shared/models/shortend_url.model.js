const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ShortendUrlSchema = new mongoose.Schema(
  {
    link_title: { type: String, required: true },
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
    password: { type: String, default: null },
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
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ShortendUrlSchema.virtual("stats", {
//   foreignField: "shortend_url_id",
//   localField: "_id",
//   ref: "Stats",
//   justOne: true,
// });

ShortendUrlSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("shortend_url", ShortendUrlSchema);

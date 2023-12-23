import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 3,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profile_img: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      select: false,
    },
    generated_links: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShortendUrl",
      },
    ],
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShortendUrl",
      },
    ],
    googleOAuthId: { type: String },
    githubOAuthId: { type: String },
    subscription: {
      customerStripeId: { type: String, required: true },
      subscribed_plan: {
        type: String,
        enum: ["trial", "personal", "team", "enterprise"],
        default: "trial",
        required: true,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  if (!this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = mongoose.model("User", userSchema);

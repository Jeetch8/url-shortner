import { env } from "@/utils/validateEnv";

export const oauthConfig = {
  google: {
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL: env.GOOGLE_CALLBACK_URL,
  },
  github: {
    clientID: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
    callbackURL: env.GITHUB_CALLBACK_URL,
  },
};

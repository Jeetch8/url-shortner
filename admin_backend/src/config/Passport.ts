// config/passport.ts
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { oauthConfig } from "./oauth";
import { UserModel } from "../models/user.model";
import { createJWT } from "@/utils/jwt";

passport.use(
  new GoogleStrategy(
    oauthConfig.google,
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await UserModel.findOne({ googleOAuthId: profile.id });
        if (!user) {
          user = await UserModel.create({
            googleOAuthId: profile.id,
            name: profile.displayName,
            email: profile.emails![0].value,
          });
        }
        const token = createJWT({
          payload: { userId: user._id.toString(), name: user.name },
        });
        return done(null, { user, token });
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    oauthConfig.github,
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) => {
      try {
        let user = await UserModel.findOne({ githubOAuthId: profile.id });
        if (!user) {
          user = await UserModel.create({
            githubOAuthId: profile.id,
            name: profile.displayName,
            email: profile.emails![0].value,
          });
        }
        const token = createJWT({
          payload: { userId: user._id.toString(), name: user.name },
        });
        return done(null, { user, token });
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

export default passport;

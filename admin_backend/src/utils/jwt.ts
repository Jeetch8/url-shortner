import jwt from "jsonwebtoken";
import { env } from "./validateEnv";
import { TokenUser } from "../types/user";

export const createJWT = ({ payload }: { payload: TokenUser }) => {
  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

export const isTokenValid = <T>({ token }: { token: string }) =>
  jwt.verify(token, env.JWT_SECRET) as T;

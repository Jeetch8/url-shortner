import * as express from "express-serve-static-core";
import { TokenUser } from "./user";
import { JwtPayload, Jwt } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: TokenUser;
    }
  }
}

declare module "jsonwebtoken" {
  export interface JwtPayload {
    name: string;
    userId: string;
  }
}

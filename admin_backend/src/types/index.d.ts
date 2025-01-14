import { Request } from "express-serve-static-core";
import { TokenUser } from "./user";

declare module "express-serve-static-core" {
  export interface Request {
    user: TokenUser;
  }
}

declare module "jsonwebtoken" {
  export interface JwtPayload {
    name: string;
    userId: string;
  }
}

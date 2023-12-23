import { Request } from "express-serve-static-core";
import { TokenUser } from "../user";

declare module "express-serve-static-core" {
  export interface Request {
    user: TokenUser;
    rawBody: any;
  }
}

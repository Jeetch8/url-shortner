import { Request } from "express";

export type TokenUser = {
  name: string;
  userId: string;
};

export interface RequestWithUser extends Request {
  user: TokenUser;
}

import { TokenUser } from "../types/user";

export const createTokenUser = (user: any): TokenUser => {
  return { name: user.name, userId: user._id.toString() };
};

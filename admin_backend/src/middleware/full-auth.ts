import { NextFunction, Request, Response } from "express";

import { UnauthorizedError, ForbiddenError } from "@shared/utils/CustomErrors";
import { isTokenValid } from "@/utils/jwt";
import { TokenUser } from "@/types/user";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }
  if (!token) {
    throw new UnauthorizedError("Authentication invalid");
  }
  try {
    const payload = isTokenValid<TokenUser>({ token });
    req.user = {
      name: payload.name,
      userId: payload.userId,
    };

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new ForbiddenError("Session expired");
    }
    throw new ForbiddenError("Authentication invalid");
  }
};

import { NextFunction, Request, Response } from 'express';
import { fromError } from 'zod-validation-error';
import {
  UnauthorizedError,
  ForbiddenError,
  BadRequestError,
} from '@shared/utils/CustomErrors';
import { isUserTokenValid } from '@/utils/jwt';
import { TokenExpiredError } from 'jsonwebtoken';
import { z } from 'zod';

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }
  if (!token) {
    throw new UnauthorizedError('Authentication invalid');
  }
  try {
    const payload = isUserTokenValid({ token });
    req.User = {
      name: payload.name,
      userId: payload.userId,
    };

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new ForbiddenError('Session expired');
    } else if (error instanceof z.ZodError) {
      throw new BadRequestError(fromError(error.errors).message);
    }
    throw new ForbiddenError('Authentication invalid');
  }
};

import { NextFunction, Request, Response } from 'express';
import { CustomError } from '@/utils/CustomErrors';
import { logger } from '@/utils/Logger';
import { fromError } from 'zod-validation-error';

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

const handleJWTError = () =>
  new CustomError('Invalid token please login again', 400);

const handleJWTExpiredError = () =>
  new CustomError('Token has expired please login again', 400);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err, 'error handler');
  let customError = {
    statusCode: err.statusCode || 500,
    msg: err.message || 'Something went wrong try again later',
  };
  if (err.name === 'JsonWebTokenError') {
    customError.msg = handleJWTError();
  } else if (err.name === 'TokenExpiredError') {
    customError.msg = handleJWTExpiredError();
  }
  if (err.name === 'ValidationError') {
    customError.msg = fromError(err).message;
    customError.statusCode = 400;
  }
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.statusCode = 400;
  }
  if (err.name === 'CastError') {
    customError.msg = `No item found with id : ${err.value}`;
    customError.statusCode = 404;
  }
  logger.error(
    `[${req.method}] ${req.path} >> StatusCode:: ${customError.statusCode}, Message:: ${customError.msg}`
  );
  return res
    .status(customError.statusCode)
    .json({ status: 'error', message: customError.msg });
};

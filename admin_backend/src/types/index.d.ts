import { Request } from 'express';
import { TokenUser } from './user';

export {};

declare global {
  namespace Express {
    interface Request {
      User: TokenUser;
      rawBody: any;
    }
  }
}

declare module 'jsonwebtoken' {
  export interface JwtPayload {
    name: string;
    userId: string;
  }
}

// export interface MRequest extends Request {
//   user: TokenUser;
//   rawBody: any;
// }

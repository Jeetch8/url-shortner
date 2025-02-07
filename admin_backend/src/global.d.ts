import * as nodeTypes from 'node';

export {};

declare global {
  namespace NodeJS {
    interface Global extends nodeTypes.Global {}
  }
}

// namespace Express {
//   interface Request {
//     user: TokenUser;
//     rawBody: any;
//   }
// }

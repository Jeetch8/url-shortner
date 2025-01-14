// src/global.d.ts
import * as nodeTypes from "node";

declare global {
  namespace NodeJS {
    interface Global extends nodeTypes.Global {}
  }
}

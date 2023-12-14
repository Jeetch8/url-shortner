import { Router } from "express";

export interface Routes {
  type?: string;
  router: Router;
}

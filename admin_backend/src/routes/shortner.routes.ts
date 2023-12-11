import express from "express";
const router = express.Router();

import {
  create_shortned_url,
  editShortnerUrl,
  deleteShortendUrl,
} from "@/controllers/shortner.controller";
import { authenticateUser } from "../middleware/full-auth";

router.post("/createLink", authenticateUser, create_shortned_url);
router.put("/edit/:id", authenticateUser, editShortnerUrl);
router.delete("/:id", authenticateUser, deleteShortendUrl);

export default router;

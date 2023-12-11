import express from "express";
import { authenticateUser } from "@/middleware/full-auth";
const router = express.Router();
import { getShortendLinkStats } from "../controllers/dashboard.controller";

router.get("/link/:id", authenticateUser, getShortendLinkStats);
// router.get("/", authenticateUser, getShortendLinkStats);

export default router;

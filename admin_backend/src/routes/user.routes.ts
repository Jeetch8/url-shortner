import express from "express";
const router = express.Router();
import {
  getMyProfile,
  updateUserProfile,
  getAllUserGeneratedLinks,
  getUserOverallStats,
  updatePassword,
  toogleFavoriteUrls,
} from "@/controllers/user.controller";
import { authenticateUser } from "../middleware/full-auth";
import upload from "@/utils/MulterConfig";

router.get("/me", authenticateUser, getMyProfile);
router.put("/", authenticateUser, upload.single("image"), updateUserProfile);
router.get("/", authenticateUser, getAllUserGeneratedLinks);
router.get("/stats", authenticateUser, getUserOverallStats);
router.patch("/change-password", authenticateUser, updatePassword);
router.patch("/favorite", authenticateUser, toogleFavoriteUrls);

export default router;

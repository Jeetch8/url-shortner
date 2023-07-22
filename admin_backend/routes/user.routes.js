const express = require("express");
const router = express.Router();
const {
  getMyProfile,
  updateUserProfile,
  getAllUserGeneratedLinks,
  getUserOverallStats,
  updatePassword,
} = require("../controllers/user.controller");
const { authenticateUser } = require("../middleware/full-auth");

router.get("/me", authenticateUser, getMyProfile);
router.put("/", authenticateUser, updateUserProfile);
router.get("/", authenticateUser, getAllUserGeneratedLinks);
router.get("/stats", authenticateUser, getUserOverallStats);
router.patch("change-password", authenticateUser, updatePassword);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  getMyProfile,
  updateUserProfile,
  getAllUserGeneratedLinks,
  getUserOverallStats,
} = require("../controllers/user.controller");
const { authenticateUser } = require("../middleware/full-auth");

router.get("/me", authenticateUser, getMyProfile);
router.put("/", authenticateUser, updateUserProfile);
router.get("/", authenticateUser, getAllUserGeneratedLinks);
router.get("/stats", authenticateUser, getUserOverallStats);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  getMyProfile,
  updateUserProfile,
  getAllUserGeneratedLinks,
} = require("../controllers/user.controller");
const { authenticateUser } = require("../middleware/full-auth");

router.get("/me", authenticateUser, getMyProfile);
router.put("/", authenticateUser, updateUserProfile);
router.get("/", authenticateUser, getAllUserGeneratedLinks);

module.exports = router;

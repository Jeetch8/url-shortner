const express = require("express");
const { authenticateUser } = require("../middleware/full-auth");
const router = express.Router();
const { getShortendLinkStats } = require("../controllers/dasdboard.controller");

router.get("/link/:id", authenticateUser, getShortendLinkStats);
// router.get("/", authenticateUser, getShortendLinkStats);

module.exports = router;

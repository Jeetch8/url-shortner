const express = require("express");
const router = express.Router();
const { getAllUserGeneratedLinks } = require("../controllers/user.controller");
const { authenticateUser } = require("../middleware/full-auth");

router.get("/", authenticateUser, getAllUserGeneratedLinks);

module.exports = router;

const express = require("express");
const router = express.Router();

const {
  handle_create_shortned_url,
} = require("../controllers/shortner.controller");
const { authenticateUser } = require("../middleware/full-auth");

router.post("/createLink", authenticateUser, handle_create_shortned_url);

module.exports = router;

const express = require("express");
const router = express.Router();

const {
  handle_create_shortned_url,
  handle_retrieve_shortned_url,
} = require("../controllers/shortner.controller");

router.get("/:id", handle_retrieve_shortned_url);
router.post("/createLink", handle_create_shortned_url);

module.exports = router;

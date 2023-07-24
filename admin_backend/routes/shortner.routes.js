const express = require("express");
const router = express.Router();

const {
  create_shortned_url,
  editShortnerUrl,
  deleteShortendUrl,
} = require("../controllers/shortner.controller");
const { authenticateUser } = require("../middleware/full-auth");

router.post("/createLink", authenticateUser, create_shortned_url);
router.put("/edit/:id", authenticateUser, editShortnerUrl);
router.delete("/:id", authenticateUser, deleteShortendUrl);

module.exports = router;

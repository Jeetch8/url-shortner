const router = require("express").Router();
const { createCampaign } = require("../controllers/Campaign.controller");
const { authenticateUser } = require("../middleware/full-auth");

router.post("/create", authenticateUser, createCampaign);

module.exports = router;

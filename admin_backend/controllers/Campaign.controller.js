const CampaignModel = require("../../shared/models/campaign.model");

const createCampaign = async (req, res) => {
  const userId = req.user.userId;
  // const {source, medium, campaign, campaign_status, campaign_term} = req.body;
  const campaign = await CampaignModel.create({
    ...req.body,
  });
  res.status(200).json({ campaign });
};

module.exports = {
  createCampaign,
};

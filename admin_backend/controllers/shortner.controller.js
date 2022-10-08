const Shortend_url_model = require("../models/shortend_url.model");
const { generate_url_cuid } = require("../utils/cuid_generator");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { isCuid } = require("@paralleldrive/cuid2");
const { isUrlValid } = require("../utils/url_checks");
const User = require("../models/user.model");

const handle_create_shortned_url = async (req, res) => {
  const original_url = req.body?.original_url;
  const userId = req.user?.userId;
  if (!original_url)
    throw new BadRequestError(
      "Body needs to conatin url that has to be shortened"
    );
  if (!isUrlValid(original_url))
    throw new BadRequestError("Provided URL is not valid");
  const cuid = generate_url_cuid();
  const urlObj = await Shortend_url_model.create({
    original_url,
    shortened_url_cuid: cuid,
  });
  await User.findByIdAndUpdate(userId, {
    $push: { generated_links: urlObj._id },
  });
  return res
    .status(StatusCodes.OK)
    .json({ shortend_url: `${process.env.base_url}/${cuid}` });
};

module.exports = {
  handle_create_shortned_url,
};

const Shortend_url_model = require("../models/shortend_url.model");
const { generate_url_cuid } = require("../utils/cuid_generator");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { isCuid } = require("@paralleldrive/cuid2");
const { isUrlValid } = require("../utils/url_checks");

const handle_create_shortned_url = async (req, res) => {
  const original_url = req.body?.original_url;
  if (!original_url)
    throw new BadRequestError(
      "Body needs to conatin url that has to be shortened"
    );
  if (!isUrlValid(original_url))
    throw new BadRequestError("Provided URL is not valid");
  const cuid = generate_url_cuid();
  await Shortend_url_model.create({
    original_url,
    shortened_url_cuid: cuid,
  });
  return res
    .status(StatusCodes.OK)
    .json({ shortend_url: `${process.env.base_url}/${cuid}` });
};

const handle_retrieve_shortned_url = async (req, res) => {
  const cuid = req.params?.id;
  if (!cuid || cuid === "" || !isCuid(cuid))
    throw new BadRequestError("Invalid link");
  const obj = await Shortend_url_model.findOne({ shortened_url_cuid: cuid });
  if (
    !obj ||
    JSON.stringify(obj) === "{}" ||
    !obj.shortened_url_cuid ||
    !obj.original_url
  )
    throw new NotFoundError("Page not found, please check your shortend link");
  return res.redirect(obj.original_url);
};

module.exports = {
  handle_create_shortned_url,
  handle_retrieve_shortned_url,
};

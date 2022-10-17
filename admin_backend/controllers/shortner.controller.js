const Shortend_url_model = require("../models/shortend_url.model");
const { generate_url_cuid } = require("../utils/cuid_generator");
const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { isUrlValid } = require("../utils/url_checks");
const User = require("../models/user.model");
const StatsModel = require("../models/stats.model");
const { parser } = require("html-metadata-parser");

const handle_create_shortned_url = async (req, res) => {
  const userId = req.user.userId;
  const { original_url } = req.body;
  if (!original_url)
    throw new BadRequestError(
      "Body needs to conatin url that has to be shortened"
    );
  if (!isUrlValid(original_url))
    throw new BadRequestError("Provided URL is not valid");
  const cuid = generate_url_cuid();
  const parsedResults = await parser(original_url);
  const urlObj = await Shortend_url_model.create({
    original_url,
    shortened_url_cuid: cuid,
    creator_id: userId,
    link_title: parsedResults.meta?.title,
    title_description: parsedResults.meta?.description,
  });
  await User.findByIdAndUpdate(userId, {
    $push: { generated_links: urlObj._id },
  });
  await StatsModel.create({
    shortend_url_id: urlObj._id,
  });
  return res
    .status(StatusCodes.OK)
    .json({ shortend_url: `${process.env.base_url}/${cuid}` });
};

const editShortnerUrl = async (req, res) => {
  const userId = req.user.userId;
  const reqBody = req.body;
  const shortendUrlId = req.params?.id;
  if (reqBody === undefined || JSON.stringify(reqBody) === "{}")
    throw new BadRequestError("Body needs to have atleast one field");
  const temp = await Shortend_url_model.findById(shortendUrlId);
  if (temp === undefined || Array.isArray(temp))
    throw new BadRequestError("Shortend url received is not valid");
  if (temp.creator_id !== userId)
    throw new UnauthenticatedError("Unauthorized to make changes");
  const newChangedUrl = await Shortend_url_model.findByIdAndUpdate(
    shortendUrlId,
    {
      ...reqBody,
    },
    { new: true }
  ).select("shortend_url_id original_url");
  return res.status(200).json({ url: newChangedUrl });
};

const deleteShortendUrl = async (req, res) => {
  const userId = req.user.userId;
  const shortendUrlId = req.params?.id;
  const temp = await Shortend_url_model.findById(shortendUrlId);
  if (temp === undefined || Array.isArray(temp))
    throw new BadRequestError("Shortend url received is not valid");
  if (temp.creator_id !== userId)
    throw new UnauthenticatedError("Unauthorized to make changes");
  await Shortend_url_model.findByIdAndDelete(shortendUrlId);
  return res.status(200).json({ msg: shortendUrlId + "deleted succesfully" });
};

module.exports = {
  handle_create_shortned_url,
  editShortnerUrl,
  deleteShortendUrl,
};

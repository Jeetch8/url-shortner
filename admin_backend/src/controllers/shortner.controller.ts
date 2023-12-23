import { ShortendUrlModel } from "@/models/shortend_url.model";
import { UserModel } from "@/models/user.model";
import { StatModel } from "@/models/stat.model";
import { generate_url_cuid } from "@/utils/cuid_generator";
import { BadRequestError, ForbiddenError } from "@shared/utils/CustomErrors";
import { StatusCodes } from "http-status-codes";
import { parser } from "html-metadata-parser";
import { Request, Response } from "express";
import { CreateShortendLinkSchema } from "src/dto/shortner.dto";
import { redisClient } from "@/utils/redisClient";
import { ShortendUrl, ShortendUrlDocument } from "@shared/types/mongoose-types";
import { APIResponseObj } from "@shared/types/controllers";

export class ShortnerController {
  public create_shortned_url = async (
    req: Request,
    res: Response<
      APIResponseObj<{
        shortend_url: string;
        msg: string;
        link: { slug: string };
      }>
    >
  ) => {
    const userId = req?.user?.userId;
    CreateShortendLinkSchema.parse(req.body);
    const { original_url, link_cloaking, passwordProtected } = req.body;
    const cuid = generate_url_cuid();
    const passwordObj: { enabled: boolean; password?: string } = {
      enabled: passwordProtected?.isPasswordProtected ?? false,
    };
    if (
      passwordProtected?.isPasswordProtected &&
      passwordProtected?.password !== undefined
    ) {
      passwordObj.password = passwordProtected?.password;
    }
    const parsedResults = await parser(original_url);
    const sharing_preview = {
      title: parsedResults.meta?.title,
      description: parsedResults.meta?.description,
      image: parsedResults.meta?.image,
    };
    const urlObj = await ShortendUrlModel.create({
      original_url,
      shortened_url_cuid: cuid,
      creator_id: userId,
      link_title: parsedResults.meta?.title,
      title_description: parsedResults.meta?.description,
      link_cloaking: link_cloaking ?? false,
      protected: passwordObj,
      sharing_preview,
    });
    await UserModel.findByIdAndUpdate(userId, {
      $push: { generated_links: urlObj._id },
    });
    await StatModel.create({
      shortend_url_id: urlObj._id,
    });
    if (!passwordObj.enabled) {
      const temp = {
        original_url,
        sharing_preview,
        link_cloaking,
        passwordProtected,
        link_enabled: urlObj.link_enabled,
      };
      await redisClient.setEx(cuid, 3600, JSON.stringify(temp));
    }
    return res.status(StatusCodes.OK).json({
      status: "success",
      data: {
        shortend_url: `${process.env.base_url}/${cuid}`,
        msg: "Url shortend",
        link: { slug: cuid },
      },
    });
  };

  public editShortnerUrl = async (
    req: Request,
    res: Response<APIResponseObj<{ shortendUrl: ShortendUrl }>>
  ) => {
    const userId = req?.user?.userId;
    const reqBody = req.body;
    const shortendUrlId = req.params?.id;
    if (reqBody === undefined || JSON.stringify(reqBody) === "{}")
      throw new BadRequestError("Body needs to have atleast one field");
    const temp: ShortendUrlDocument | null = await ShortendUrlModel.findById(
      shortendUrlId
    );
    if (!temp || !Array.isArray(temp))
      throw new BadRequestError("Shortend url received is not valid");
    if (temp.creator_id?.toString() !== userId)
      throw new ForbiddenError("Unauthorized to make changes");
    const newChangedUrl: ShortendUrl | null =
      await ShortendUrlModel.findByIdAndUpdate(
        shortendUrlId,
        {
          ...reqBody,
        },
        { new: true }
      );
    if (!newChangedUrl) throw new BadRequestError("Something went wrong");
    return res
      .status(200)
      .json({ status: "success", data: { shortendUrl: newChangedUrl } });
  };

  public deleteShortendUrl = async (
    req: Request,
    res: Response<APIResponseObj<{ msg: String }>>
  ) => {
    const userId = req?.user?.userId;
    const shortendUrlId = req.params?.id;
    const temp: ShortendUrlDocument | null = await ShortendUrlModel.findById(
      shortendUrlId
    );
    if (!temp) throw new BadRequestError("Shortend url received is not valid");
    if (temp.creator_id?.toString() !== userId)
      throw new ForbiddenError("Unauthorized to make changes");
    await ShortendUrlModel.findByIdAndDelete(shortendUrlId);
    await redisClient.del(shortendUrlId);
    return res
      .status(200)
      .json({
        status: "success",
        data: { msg: shortendUrlId + "deleted succesfully" },
      });
  };
}

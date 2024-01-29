import { ShortendUrlModel } from "@/models/shortend_url.model";
import { UserModel } from "@/models/user.model";
import { StatModel } from "@/models/stat.model";
import { generate_url_cuid } from "@/utils/cuid_generator";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "@shared/utils/CustomErrors";
import { StatusCodes } from "http-status-codes";
import { parser } from "html-metadata-parser";
import { Request, Response } from "express";
import { CreateShortendLinkSchema } from "src/dto/shortner.dto";
import { redisClient } from "@/utils/redisClient";
import {
  ShortendUrl,
  ShortendUrlDocument,
  User,
} from "@shared/types/mongoose-types";
import { APIResponseObj } from "@shared/types/controllers";
import { SubscriptionModel } from "@/models/subscription.model";
import mongoose from "mongoose";

export class ShortnerController {
  public getAllUserGeneratedLinks = async (req: Request, res: Response) => {
    const userId = req?.user?.userId;
    const dbResult: any = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "shortendurls",
          localField: "generated_links",
          foreignField: "_id",
          as: "generated_links",
          pipeline: [
            {
              $project: {
                clicker_info: 0,
                updatedAt: 0,
                __v: 0,
                creator_id: 0,
              },
            },
            {
              $lookup: {
                from: "stats",
                localField: "stats",
                foreignField: "_id",
                as: "stats",
              },
            },
          ],
        },
      },
    ]);
    const dbUser: User & { generated_links: ShortendUrl[] } = dbResult[0];
    if (!dbUser) throw new UnauthorizedError("UserModel not found");
    const favoritesSet = new Set(dbUser.favorites.map((el) => el.toString()));
    const generated_links = dbUser.generated_links.map((el: ShortendUrl) => ({
      ...el,
      favorite: favoritesSet.has(el._id.toString()),
    }));
    return res
      .status(StatusCodes.OK)
      .json({ status: "success", data: { generated_links: generated_links } });
  };

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
    console.log(req.body);
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
      link_title: parsedResults.meta?.title,
      link_enabled: true,
      link_description: parsedResults.meta?.description,
      original_url,
      shortend_url_cuid: cuid,
      creator_id: userId,
      link_cloaking: link_cloaking ?? false,
      sharing_preview,
      protected: passwordObj,
      link_expiry: {
        enabled: false,
      },
      link_targetting: {
        enabled: false,
      },
    });
    const updatedUser = await UserModel.findByIdAndUpdate(userId, {
      $push: { generated_links: urlObj._id.toString() },
    });
    const newStats = await StatModel.create({
      shortend_url_id: urlObj._id,
      total_clicks: 0,
      clicker_info: [],
    });
    await ShortendUrlModel.findByIdAndUpdate(urlObj._id, {
      stats: newStats._id.toString(),
    });
    if (!updatedUser) throw new BadRequestError("Error updating user");
    await SubscriptionModel.findByIdAndUpdate(updatedUser?.subscription_id, {
      usuage: {
        link_generated: updatedUser?.generated_links.length + 1,
      },
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
    return res.status(200).json({
      status: "success",
      data: { msg: shortendUrlId + "deleted succesfully" },
    });
  };

  public getShortendUrl = async (req: Request, res: Response) => {
    const urlDocumentId = req.params.id;
    const dbQuery = await ShortendUrlModel.findById(urlDocumentId);
    if (!dbQuery) throw new NotFoundError("Shortend url not found");
    const queryObj = dbQuery.toObject();
    const data: any = {};
    // const data: { data: any[]; label: any[] } = { data: [], label: [] };
    const iterate = (obj: any) => {
      Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === "object") {
          const nestedObj = obj[key];
          Object.keys(nestedObj).forEach((key2) => {
            data[`${key}.${key2}`] = nestedObj[key2];
          });
        } else {
          data[key] = obj[key];
        }
      });
    };
    iterate(queryObj);
    return res
      .status(200)
      .json({ status: "success", data: { link: dbQuery, data } });
  };
}

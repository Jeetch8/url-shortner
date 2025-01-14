import { ShortendUrl, Stat } from "../mongoose-types";

interface PopulatedShortnedUrl
  extends Omit<ShortendUrl, "clicker_info" | "updatedAt" | "creator_id"> {
  stats: Stat;
}

export interface IGetAllUserGeneratedLinksDataRes {
  generated_links: PopulatedShortnedUrl[];
}

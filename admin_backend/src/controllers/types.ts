import { ShortendUrlDocumentType } from "@shared/models/shortend_url.model";
import { StatsDocumentType } from "@shared/models/stats.model";

export interface ShortendUrlWithStats
  extends Omit<ShortendUrlDocumentType, "stats" | "protected.password"> {
  stats: StatsDocumentType;
}

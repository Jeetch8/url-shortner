import { ShortendUrl } from "@shared/models/shortend_url.model";
import { IsBoolean } from "class-validator";

export class UserFavoritesShortnedLink extends ShortendUrl {
  @IsBoolean()
  favorite: boolean = false;
}

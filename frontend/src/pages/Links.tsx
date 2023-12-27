export interface StatsPopulatedShortnedUrl
  extends Omit<ShortendUrl, "clicker_info" | "updatedAt" | "creator_id"> {
  stats: Stat;
  favorite: boolean;
}

export interface IUserGeneratedLinksResp {
  generated_links: StatsPopulatedShortnedUrl[];
}

import { useEffect } from "react";
import GeneratedLinkList from "../components/Links/GeneratedLinkList";
import { useFetch } from "../hooks/useFetch";
import { base_url } from "../utils/base_url";
import { twMerge } from "tailwind-merge";
import { useUserContext } from "../context/UserContext";
import {
  PopulatedDocument,
  ShortendUrl,
  ShortendUrlDocument,
  Stat,
} from "@shared/types/mongoose-types";

const Links = () => {
  const { user } = useUserContext();
  const {
    fetchState: generatedLinksState,
    doFetch: fetchGeneratedLinks,
    dataRef: generatedLinksData,
    errorRef: generatedLinksError,
  } = useFetch<IUserGeneratedLinksResp>({
    url: base_url + "/user/",
    method: "GET",
    authorized: true,
  });

  useEffect(() => {
    fetchGeneratedLinks();
  }, []);

  return (
    <div
      className={twMerge(
        "max-w-[1600px] w-full mx-auto px-4 py-4",
        user?.subscription_warninig.visible && "pt-[35px]"
      )}
    >
      <h1 className=" text-3xl font-bold">Links</h1>
      <GeneratedLinkList
        fetchGeneratedLinks={fetchGeneratedLinks}
        generatedLinksData={generatedLinksData}
        generatedLinksError={generatedLinksError}
        generatedLinksState={generatedLinksState}
      />
    </div>
  );
};

export default Links;

import React, { useEffect } from "react";
import GeneratedLinkList from "../components/Links/GeneratedLinkList";
import { useFetch } from "../hooks/useFetch";
import { base_url } from "../utils/base_url";

const Links = () => {
  const {
    fetchState: generatedLinksState,
    doFetch: fetchGeneratedLinks,
    dataRef: generatedLinksData,
    errorRef: generatedLinksError,
  } = useFetch({ url: base_url + "/user/", method: "GET", authorized: true });

  useEffect(() => {
    fetchGeneratedLinks();
  }, []);

  return (
    <div className="max-w-[1600px] w-full mx-auto px-4 py-4">
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

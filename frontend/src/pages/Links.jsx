import React, { useEffect } from "react";
import GeneratedLinkList from "../components/GeneratedLinkList";
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
    <div>
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

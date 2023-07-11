import React, { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { base_url } from "../utils/base_url";
import { toast } from "react-hot-toast";
import GeneratedLinkList from "../components/GeneratedLinkList";
import CreateShortendLink from "../components/CreateShortendLink";

const Home = () => {
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
    <div className="flex justify-center">
      <div className="border-2 border-stone-300 w-[600px] py-10">
        <h1 className="text-2xl font-bold text-center">URL Shortner</h1>
        <CreateShortendLink fetchGeneratedLinks={fetchGeneratedLinks} />
        <GeneratedLinkList
          fetchGeneratedLinks={fetchGeneratedLinks}
          generatedLinksData={generatedLinksData}
          generatedLinksError={generatedLinksError}
          generatedLinksState={generatedLinksState}
        />
      </div>
    </div>
  );
};

export default Home;

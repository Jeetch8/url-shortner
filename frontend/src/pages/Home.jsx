import React, { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { base_url } from "../utils/base_url";
import { toast } from "react-hot-toast";
import GeneratedLinkList from "../components/GeneratedLinkList";
// import CreateShortendLink from "./CreateShortendLink";

const Home = () => {
  return (
    <div className="px-8 py-10">
      <h1 className="text-2xl font-bold text-center">URL Shortner</h1>
      {/* <CreateShortendLink fetchGeneratedLinks={fetchGeneratedLinks} /> */}
      {/* <GeneratedLinkList
        fetchGeneratedLinks={fetchGeneratedLinks}
        generatedLinksData={generatedLinksData}
        generatedLinksError={generatedLinksError}
        generatedLinksState={generatedLinksState}
      /> */}
    </div>
  );
};

export default Home;

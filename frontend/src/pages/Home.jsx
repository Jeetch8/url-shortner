import React, { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { base_url } from "../utils/base_url";
import { toast } from "react-hot-toast";
import GeneratedLinkList from "../components/GeneratedLinkList";
import ReactLoading from "react-loading";

const Home = () => {
  const [userInput, setUserInput] = useState("");

  const { fetchState: newLinkFetchState, doFetch: FetchNewLink } = useFetch({
    url: base_url + "/url/createLink",
    method: "POST",
    authorized: true,
    onSuccess: () => {
      setUserInput("");
      toast.success("Link Generated");
      fetchGeneratedLinks();
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const {
    fetchState: generatedLinksState,
    doFetch: fetchGeneratedLinks,
    dataRef: generatedLinksData,
    errorRef: generatedLinksError,
  } = useFetch({ url: base_url + "/user/", method: "GET", authorized: true });

  useEffect(() => {
    fetchGeneratedLinks();
  }, []);

  const handleUrlSubmit = async () => {
    if (userInput !== undefined || userInput !== "") {
      await FetchNewLink({ original_url: userInput });
    }
  };

  return (
    <div className="flex justify-center">
      <div className="border-2 border-stone-300 w-[600px] py-10">
        <h1 className="text-2xl font-bold text-center">URL Shortner</h1>
        <div className="flex border-[1px] my-4 mx-auto w-fit rounded-md">
          <input
            className="outline-none px-2"
            type="text"
            onChange={(e) => setUserInput(e.target.value)}
            value={userInput}
          />
          <button
            disabled={newLinkFetchState === "loading"}
            onClick={handleUrlSubmit}
            className="bg-stone-300 px-4 py-2 rounded-md"
          >
            {newLinkFetchState === "loading" ? (
              <ReactLoading
                type="spin"
                color="#ffffff"
                height="25px"
                width="25px"
              />
            ) : (
              "Generate Url"
            )}
          </button>
        </div>
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

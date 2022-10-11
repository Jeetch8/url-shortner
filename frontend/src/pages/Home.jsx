import React, { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { base_url } from "../utils/base_url";
import { getUserFromLocalStorage } from "../utils/localstorage";
import { toast } from "react-hot-toast";

import GeneratedLinkList from "../components/GeneratedLinkList";

const Home = () => {
  const [userInput, setUserInput] = useState("");

  const { fetchState: newLinkFetchState, doFetch: FetchNewLink } = useFetch(
    base_url + "/url/createLink",
    "POST",
    {
      authorization: `Bearer ${getUserFromLocalStorage().token}`,
    }
  );

  const handleUrlSubmit = async () => {
    if (userInput !== undefined || userInput !== "") {
      await FetchNewLink({ original_url: userInput });
      if (newLinkFetchState === "idle") {
        setUserInput("");
        toast.success("Link Generated");
        // fetchGeneratedLinks();
      }
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
            onClick={handleUrlSubmit}
            className="bg-stone-300 px-4 py-2 rounded-md"
          >
            Generate Url
          </button>
        </div>
        <GeneratedLinkList />
      </div>
    </div>
  );
};

export default Home;

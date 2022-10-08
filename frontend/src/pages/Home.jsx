import React, { useEffect, useState } from "react";
import DataToShow from "../components/DataToShow";
import { useFetch } from "../hooks/useFetch";
import { base_url, url_retrival_base_url } from "../utils/base_url";
import { getUserFromLocalStorage } from "../utils/localstorage";

const Home = () => {
  const [userInput, setUserInput] = useState("");
  const { fetchState: newLinkFetchState, doFetch: FetchNewLink } = useFetch(
    base_url + "/url/createLink",
    "POST",
    {
      authorization: `Bearer ${getUserFromLocalStorage().token}`,
    }
  );
  const {
    fetchState: generatedLinksState,
    doFetch: fetchGeneratedLinks,
    dataRef: generatedLinkData,
  } = useFetch(base_url + "/user/", "GET", {
    authorization: `Bearer ${getUserFromLocalStorage().token}`,
  });

  useEffect(() => {
    fetchGeneratedLinks();
  }, []);

  console.log(generatedLinkData.current);

  const handleUrlSubmit = async () => {
    if (userInput !== undefined || userInput !== "") {
      await FetchNewLink({ original_url: userInput });
      if (
        newLinkFetchState.state === "idle" &&
        newLinkFetchState.data !== null
      ) {
        setUserInput("");
      }
    }
  };

  return (
    <div className="flex justify-center">
      <div className="border-2 border-stone-300 w-[500px] py-10">
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
        <DataToShow fetchstate={newLinkFetchState} />
        {generatedLinkData.current?.generated_links && (
          <ul className=" list-decimal">
            asdasd
            {generatedLinkData.current?.generated_links?.map((el) => {
              return (
                <li key={el._id}>
                  <a
                    href={`${url_retrival_base_url}/${el.shortened_url_cuid}`}
                    className="text-blue-500 underline"
                  >
                    {`${url_retrival_base_url}/${el.shortened_url_cuid}`}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;

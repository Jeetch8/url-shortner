import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useFetch } from "../hooks/useFetch";
import { base_url } from "../utils/base_url";
import ReactLoading from "react-loading";

const CreateShortendLink = ({ fetchGeneratedLinks }) => {
  const [userInput, setUserInput] = useState("");
  const [isLinkCloaked, setIsLinkCloaked] = useState(false);

  const { fetchState: newLinkFetchState, doFetch: FetchNewLink } = useFetch({
    url: base_url + "/url/createLink",
    method: "POST",
    authorized: true,
    onSuccess: () => {
      setUserInput("");
      toast.success("Link Generated");
      fetchGeneratedLinks();
      setIsLinkCloaked(false);
    },
    onError: (err) => {
      toast.error("Error generating link");
      console.log(err);
      setIsLinkCloaked(false);
    },
  });

  const handleUrlSubmit = async () => {
    if (userInput !== undefined || userInput !== "") {
      await FetchNewLink({
        original_url: userInput,
        link_cloaking: isLinkCloaked,
      });
    }
  };

  return (
    <div>
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
      <div className="py-2 px-2 m-6">
        <label htmlFor="one">
          <input
            id="one"
            type="checkbox"
            onChange={(e) => setIsLinkCloaked(e.target.checked)}
            value={isLinkCloaked}
          />
          Link Cloaking
        </label>
      </div>
      <div>
        <h2 className="text-xl font-semibold">Link preview</h2>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          className="mt-2 border-2 outline-none rounded-md ml-2"
        />
        <br />
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          className="mt-2 border-2 outline-none rounded-md ml-2"
        />
        <br />
        <label htmlFor="image">Image</label>
        <input type="file" id="image" />
      </div>
    </div>
  );
};

export default CreateShortendLink;

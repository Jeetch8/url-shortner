const base_url = "http://localhost:5000";

import React, { useState } from "react";
import DataToShow from "./DataToShow";

const App = () => {
  const [userInput, setUserInput] = useState("");
  const [fetchstate, setFetchState] = useState({
    state: "idle", //idle,isLoading,Error
    data: null,
    error: null,
  });

  const handleUrlSubmit = async () => {
    if (userInput !== "" || userInput !== undefined) {
      console.log("asdasd");
      setFetchState({ state: "loading", error: null, data: null });
      try {
        console.log(base_url, "klk");
        const req = await fetch(base_url + "/createLink", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ original_url: userInput }),
        });
        const res = await req.json();
        console.log(res);
        setFetchState({ data: res, state: "idle", error: null });
        setUserInput("");
      } catch (error) {
        setFetchState((prev) => {
          return { error, state: "error", ...prev };
        });
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
        <DataToShow fetchstate={fetchstate} />
      </div>
    </div>
  );
};

export default App;

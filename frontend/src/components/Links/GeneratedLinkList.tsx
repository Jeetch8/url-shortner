import { useFetch } from "../../hooks/useFetch";
import LinkCard from "./LinkCard";
import { IUserGeneratedLinksResp } from "../../pages/Links";
import { base_url } from "../../utils/base_url";
import { useEffect } from "react";
import { BeatLoader } from "react-spinners";

const GeneratedLinkList = () => {
  const {
    fetchState: generatedLinksState,
    doFetch: fetchGeneratedLinks,
    dataRef: generatedLinksData,
    errorRef: generatedLinksError,
  } = useFetch<IUserGeneratedLinksResp>({
    url: base_url + "/url/",
    method: "GET",
    authorized: true,
  });

  useEffect(() => {
    fetchGeneratedLinks();
  }, []);

  if (generatedLinksState === "loading") {
    return (
      <div className="flex items-center mt-20 justify-center">
        <BeatLoader color="black" role="loader" />
      </div>
    );
  }
  if (generatedLinksState === "error") {
    return (
      <p className="text-red-500 text-center">
        {generatedLinksError.current?.message}
      </p>
    );
  }

  if (generatedLinksData.current?.generated_links.length === 0) {
    return (
      <div className=" border-t-2 mt-6 pt-5 text-center font-semibold text-lg">
        <p>No Links to show here</p>
      </div>
    );
  }

  if (
    generatedLinksState === "success" &&
    generatedLinksData.current !== null
  ) {
    return (
      <div className=" border-t-2 mt-6">
        {generatedLinksData.current?.generated_links && (
          <ul className="mt-8">
            {generatedLinksData.current?.generated_links?.map((el) => {
              return (
                <LinkCard
                  el={el}
                  key={el._id.toString()}
                  fetchGeneratedLinks={fetchGeneratedLinks}
                />
              );
            })}
          </ul>
        )}
      </div>
    );
  }
};

export default GeneratedLinkList;

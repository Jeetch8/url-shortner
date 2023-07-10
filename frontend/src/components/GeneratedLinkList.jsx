import React from "react";
import GeneratedLink from "./GeneratedLink";

const GeneratedLinkList = ({
  generatedLinksState,
  generatedLinksData,
  generatedLinksError,
  fetchGeneratedLinks,
}) => {
  if (generatedLinksState === "loading") {
    return <p className="text-center">Loading...</p>;
  }
  if (generatedLinksState === "error") {
    return (
      <p className="text-red-500 text-center">
        {generatedLinksError.current.msg}
      </p>
    );
  }

  if (
    generatedLinksState === "success" &&
    generatedLinksData.current !== null
  ) {
    return (
      <>
        {generatedLinksData.current?.generated_links && (
          <ul className="mt-8">
            {generatedLinksData.current?.generated_links?.map((el) => {
              return (
                <GeneratedLink
                  el={el}
                  key={el._id}
                  fetchGeneratedLinks={fetchGeneratedLinks}
                />
              );
            })}
          </ul>
        )}
      </>
    );
  }
};

export default GeneratedLinkList;

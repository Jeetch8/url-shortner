interface IProps {
  generatedLinksState: FetchStates;
  generatedLinksData: {
    current: IUserGeneratedLinksResp | null;
  };
  generatedLinksError: { current: ApiError | null };
  fetchGeneratedLinks: () => void;
}

import { ApiError, FetchStates } from "../../hooks/useFetch";
import LinkCard from "./LinkCard";
import { IUserGeneratedLinksResp } from "../../pages/Links";

const GeneratedLinkList = ({
  generatedLinksState,
  generatedLinksData,
  generatedLinksError,
  fetchGeneratedLinks,
}: IProps) => {
  if (generatedLinksState === "loading") {
    return <p className="text-center">Loading...</p>;
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

import React from "react";
import { FaCopy } from "react-icons/fa6";
import { IoStatsChart } from "react-icons/io5";
import useCopyToClipboard from "../hooks/useCopyToClipboard";
import { useNavigate } from "react-router-dom";
import { url_retrival_base_url } from "../utils/base_url";
import { MdEdit } from "react-icons/md";
import EditLinkModal from "./EditLinkModal";

const GeneratedLinkList = ({
  generatedLinksState,
  generatedLinksData,
  generatedLinksError,
}) => {
  const navigate = useNavigate();
  const [value, copyToClipboard] = useCopyToClipboard();

  const handleCopyToClipboard = (link) => {
    copyToClipboard(link);
    toast.success("Text Copyied to clipboard");
  };

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
                <li key={el._id} className="flex justify-between px-4 py-4">
                  <div>
                    <div>
                      <a
                        href={`${url_retrival_base_url}/${el.shortened_url_cuid}`}
                        className="hover:underline"
                      >
                        {`${"localhost/"}${el.shortened_url_cuid}`}
                      </a>
                      <FaCopy
                        className=" inline-block ml-3 mb-1 cursor-pointer hover:bg-[rgba(0,0,0,0.1)]"
                        onClick={() =>
                          handleCopyToClipboard(el.shortened_url_cuid)
                        }
                      />
                    </div>
                    <a href={el.original_url} className="underline text-[14px]">
                      <img
                        className="inline-block mr-2"
                        src={`https://www.google.com/s2/favicons?domain=${el.original_url}`}
                        alt="favicon"
                      />
                      {`${el.original_url.substring(0, 50)}...`}
                    </a>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <button
                      className="flex items-center gap-x-1 rounded-md p-1 hover:bg-[rgba(0,0,0,0.1)] h-fit"
                      onClick={() =>
                        navigate("/stats/" + el.shortened_url_cuid)
                      }
                    >
                      <IoStatsChart />
                    </button>
                    <EditLinkModal data={el} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </>
    );
  }
};

export default GeneratedLinkList;

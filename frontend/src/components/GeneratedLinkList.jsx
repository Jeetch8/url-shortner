import React, { useEffect } from "react";
import { useFetch } from "../hooks/useFetch";
import { FaCopy } from "react-icons/fa6";
import { IoStatsChart } from "react-icons/io5";
import useCopyToClipboard from "../hooks/useCopyToClipboard";
import { useNavigate } from "react-router-dom";
import { url_retrival_base_url } from "../utils/base_url";

const GeneratedLinkList = () => {
  const { fetchState, doFetch, dataRef, errorRef } = useFetch(
    base_url + "/user/",
    "GET",
    {
      authorization: `Bearer ${getUserFromLocalStorage().token}`,
    }
  );
  const navigate = useNavigate();
  const [value, copyToClipboard] = useCopyToClipboard();

  useEffect(() => {
    doFetch();
  }, []);

  const handleCopyToClipboard = (link) => {
    copyToClipboard(link);
    toast.success("Text Copyied to clipboard");
  };

  if (fetchState === "loading") {
    return <p className="text-center">Loading...</p>;
  }
  if (fetchState === "error") {
    return <p className="text-red-500 text-center">{fetchstate.error.msg}</p>;
  }

  if (fetchState === "idle" && dataRef.current !== null) {
    return (
      <>
        {dataRef.current?.generated_links && (
          <ul className="">
            {dataRef.current?.generated_links?.map((el) => {
              return (
                <li key={el._id} className="flex justify-between px-4">
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
                  <div
                    className="p-1 hover:bg-[rgba(0,0,0,0.1)] h-fit cursor-pointer"
                    onClick={() => navigate("/stats/" + el.shortened_url_cuid)}
                  >
                    <IoStatsChart />
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

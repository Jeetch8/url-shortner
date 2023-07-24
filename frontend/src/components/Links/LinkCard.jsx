import React from "react";
import { useFetch } from "../../hooks/useFetch";
import { base_url } from "../../utils/base_url";
import { useNavigate } from "react-router-dom";
import { FaCopy } from "react-icons/fa6";
import { IoStatsChart } from "react-icons/io5";
import { url_retrival_base_url } from "../../utils/base_url";
import EditLinkModal from "../EditLinkModal";
import { MdDelete } from "react-icons/md";
import useCopyToClipboard from "../../hooks/useCopyToClipboard";
import toast from "react-hot-toast";
import AvatarImage from "../AvatarImage";
import { IoIosStats } from "react-icons/io";
import { FaRegCalendar } from "react-icons/fa6";
import { TfiEye } from "react-icons/tfi";

const LinkCard = ({ el, fetchGeneratedLinks }) => {
  const navigate = useNavigate();
  const [value, copyToClipboard] = useCopyToClipboard();
  const { doFetch, fetchState } = useFetch({
    url: base_url + "/url/" + el._id,
    method: "DELETE",
    authorized: true,
    onSuccess: () => {
      fetchGeneratedLinks();
      toast.success("Link deleted");
    },
  });

  const handleCopyToClipboard = (link) => {
    copyToClipboard(link);
    toast.success("Text Copyied to clipboard");
  };

  const handleLinkDelete = async () => {
    await doFetch();
  };

  return (
    <li
      key={el._id}
      className="flex justify-between px-5 py-7 bg-white my-4 rounded-lg"
    >
      <div className="flex items-center gap-x-6">
        <div className="border-2 rounded-full p-1">
          <AvatarImage
            diameter={"35px"}
            url={`https://www.google.com/s2/favicons?domain=${el.original_url}&sz=40`}
          />
        </div>
        <div>
          <a
            href={`/links/${el.shortened_url_cuid}`}
            className="text-xl cursor-pointer"
          >
            {el?.link_title}
          </a>
          <div className="mt-4">
            <a
              href={`${url_retrival_base_url}/${el.shortened_url_cuid}`}
              className="hover:underline text-blue-700"
            >
              {`${url_retrival_base_url}/${el.shortened_url_cuid}`}
            </a>
            <FaCopy
              className=" inline-block ml-3 mb-1 cursor-pointer hover:bg-[rgba(0,0,0,0.1)]"
              onClick={() =>
                handleCopyToClipboard(
                  `${url_retrival_base_url}/el.shortened_url_cuid`
                )
              }
            />
          </div>
          <a href={el.original_url} className="text-[14px] text-gray-600">
            {`${el.original_url.substring(0, 50)}...`}
          </a>
          <div className="flex gap-x-6 mt-3 items-center">
            <div className="w-fit flex items-center gap-x-2 px-2 rounded-md py-[2px]">
              <IoIosStats color="green" />
              <span className="text-green-500 text-sm font-semibold">
                {el.stats.total_clicks}{" "}
                {el.stats.total_clicks > 1 ? "Clicks" : "Click"}
              </span>
            </div>
            <div className="flex items-center text-sm gap-x-2">
              <FaRegCalendar />
              <span>{new Date(el.createdAt).toDateString()}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-x-2">
        <a
          href={"/links/" + el.shortened_url_cuid}
          className="flex items-center gap-x-1 rounded-md p-1 hover:bg-[rgba(0,0,0,0.1)] h-fit text-sm border-2 px-2 text-neutral-800"
        >
          <TfiEye className="inline" size={"16px"} />
          <span>View</span>
        </a>
        <EditLinkModal data={el} />
        <button
          className="flex items-center gap-x-1 rounded-md hover:bg-[rgba(0,0,0,0.1)] h-fit border-2 px-2 py-[2px]"
          onClick={handleLinkDelete}
        >
          <MdDelete />
          <span>Delete</span>
        </button>
      </div>
    </li>
  );
};

export default LinkCard;

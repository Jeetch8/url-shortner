interface IProps {
  fetchGeneratedLinks: () => void;
  linkObj: StatsPopulatedShortnedUrl;
}

import { useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { HiShare } from "react-icons/hi";
import { IoCopySharp } from "react-icons/io5";
import { LiaExternalLinkAltSolid } from "react-icons/lia";
import { MdEdit } from "react-icons/md";
import { useFetch } from "../hooks/useFetch";
import { base_url, url_retrival_base_url } from "../utils/base_url";
import { Tooltip } from "react-tooltip";
import { IoMdStar } from "react-icons/io";
import { twMerge } from "tailwind-merge";
import useCopyToClipboard from "../hooks/useCopyToClipboard";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import LinkShareModal from "./Modal/LinkShareModal";
import { StatsPopulatedShortnedUrl } from "../pages/Links";

const GeneralLinkHelpers = ({ linkObj, fetchGeneratedLinks }: IProps) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const navigate = useNavigate();
  const { copyToClipboard } = useCopyToClipboard();
  const { doFetch: toogleFavoriteFetch } = useFetch({
    url: base_url + "/user/favorite",
    authorized: true,
    method: "PATCH",
    onSuccess: (res) => {
      console.log(res, "onSuccess");
      linkObj.favorite = res.favorite;
    },
  });
  const { doFetch: deleteLinkFetch } = useFetch({
    url: base_url + "/url/" + linkObj?._id,
    method: "DELETE",
    authorized: true,
    onSuccess: () => {
      fetchGeneratedLinks();
      toast.success("Link deleted");
    },
  });

  const options = [
    {
      icon: (
        <IoMdStar
          size={26}
          className={twMerge(
            "hover:fill-yellow-500",
            linkObj?.favorite && "fill-yellow-500"
          )}
        />
      ),
      tooltip_text: "Favorite",
      clickHandler: () => {
        console.log("favorite click");
        toogleFavoriteFetch({ shortendUrlId: linkObj?._id });
      },
    },
    {
      icon: (
        <LiaExternalLinkAltSolid size={23} className="hover:fill-blue-600" />
      ),
      tooltip_text: "Visit Url",
      clickHandler: () => {
        window.open(`${url_retrival_base_url}/${linkObj?.shortend_url_cuid}`);
      },
    },
    {
      icon: <IoCopySharp size={18} className="hover:fill-blue-600" />,
      tooltip_text: "Copy",
      clickHandler: () => {
        if (linkObj.shortend_url_cuid)
          copyToClipboard(
            `${url_retrival_base_url}/${linkObj.shortend_url_cuid}`
          );
        toast.success("Text Copied");
      },
    },
    {
      icon: <HiShare size={19} className="hover:fill-blue-600" />,
      tooltip_text: "Share",
      clickHandler: () => {
        setIsShareModalOpen(true);
      },
    },
    {
      icon: <MdEdit size={21} className="hover:fill-blue-600" />,
      tooltip_text: "Edit",
      clickHandler: () => {
        navigate(`/links/${linkObj?._id}/edit`);
      },
    },
    {
      icon: <FaTrash size={16} className="hover:fill-red-700" />,
      tooltip_text: "Trash",
      clickHandler: () => {
        deleteLinkFetch();
      },
    },
  ];

  return (
    <div className="flex items-center gap-x-3">
      {options.map((el) => {
        return (
          <div key={el.tooltip_text}>
            <a
              role="icon-button"
              aria-label={"btn_" + el.tooltip_text}
              data-tooltip-id={el.tooltip_text}
              className="cursor-pointer"
              onClick={el?.clickHandler}
            >
              {el.icon}
            </a>
            <Tooltip id={el.tooltip_text}>
              <p>{el.tooltip_text}</p>
            </Tooltip>
          </div>
        );
      })}
      <LinkShareModal
        isModalOpen={isShareModalOpen}
        setIsModalOpen={setIsShareModalOpen}
        linkInfo={linkObj}
      />
    </div>
  );
};

export default GeneralLinkHelpers;

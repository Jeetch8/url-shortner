interface IProps {
  fetchGeneratedLinks: () => void;
  el: StatsPopulatedShortnedUrl;
}

import { Link } from "react-router-dom";
import { url_retrival_base_url } from "../../utils/base_url";
import AvatarImage from "../AvatarImage";
import { IoIosStats } from "react-icons/io";
import { FaRegCalendar } from "react-icons/fa6";
import GeneralLinkFunctions from "../GeneralLinkFunctions";
import { StatsPopulatedShortnedUrl } from "../../pages/Links";

const LinkCard = ({ el, fetchGeneratedLinks }: IProps) => {
  return (
    <li
      key={el._id.toString()}
      className="flex justify-between px-5 py-7 bg-white my-4 rounded-lg items-start pr-5"
    >
      <div className="flex items-center gap-x-6">
        <div className="border-2 rounded-full p-1">
          <AvatarImage
            diameter={"35px"}
            url={`https://www.google.com/s2/favicons?domain=${el.original_url}&sz=40`}
          />
        </div>
        <div>
          <Link
            to={`/links/${el.shortend_url_cuid}`}
            className="text-xl cursor-pointer"
          >
            {el?.link_title}
          </Link>
          <div className="mt-2">
            <a
              href={`${url_retrival_base_url}/${el.shortend_url_cuid}`}
              className="hover:underline text-blue-700"
            >
              {`${url_retrival_base_url}/${el.shortend_url_cuid}`}
            </a>
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
              <span>
                {new Date(el.createdAt?.toString() as string).toDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
      <GeneralLinkFunctions
        linkObj={el}
        fetchGeneratedLinks={fetchGeneratedLinks}
      />
    </li>
  );
};

export default LinkCard;

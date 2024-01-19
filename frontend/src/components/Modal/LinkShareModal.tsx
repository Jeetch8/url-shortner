import React, { useCallback, useEffect, useRef } from "react";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  LinkedinShareButton,
  LinkedinIcon,
  EmailIcon,
  EmailShareButton,
  XIcon,
} from "react-share";
import { IoClose } from "react-icons/io5";
import { url_retrival_base_url } from "../../utils/base_url";
import AvatarImage from "../AvatarImage";

const LinkShareModal = ({ isModalOpen, setIsModalOpen, linkInfo }) => {
  const blackScreenRef = useRef(null);
  const modalRef = useRef(null);
  const handleClickOutside = useCallback((event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setIsModalOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);

    return () =>
      document.removeEventListener("click", handleClickOutside, true);
  }, []);
  return (
    <>
      {isModalOpen && (
        <div
          className="h-[100vh] w-[100vw] top-0 left-0 absolute bg-[rgba(0,0,0,0.1)] flex items-center justify-center"
          ref={blackScreenRef}
        >
          <div
            className="bg-white rounded-md px-6 py-6 max-w-[500px] w-full"
            ref={modalRef}
          >
            <div>
              <div className="flex justify-end">
                <button onClick={() => setIsModalOpen(false)}>
                  <IoClose size={22} />
                </button>
              </div>
              <div>
                <div className="flex items-center mt-4 mb-2">
                  <AvatarImage
                    diameter={"35px"}
                    url={`https://www.google.com/s2/favicons?domain=${linkInfo.original_url}&sz=40`}
                  />
                  <h2 className="text-2xl ml-2">{linkInfo.link_title}</h2>
                </div>
                <a
                  href={linkInfo.original_url}
                  className="underline"
                  target="_blank"
                >
                  {linkInfo.original_url}
                </a>
              </div>
              <div className="flex items-center gap-x-6 my-6">
                <div>
                  <button className="px-5 bg-neutral-200 rounded-full py-2 hover:bg-neutral-400   duration-200">
                    Copy Link
                  </button>
                </div>
                <div className="flex gap-x-3">
                  <FacebookShareButton
                    url={`${url_retrival_base_url}/${linkInfo?.shortened_url_cuid}`}
                  >
                    <FacebookIcon round size={35} />
                  </FacebookShareButton>
                  <TwitterShareButton
                    url={`${url_retrival_base_url}/${linkInfo?.shortened_url_cuid}`}
                  >
                    <XIcon borderRadius={8} size={32} />
                  </TwitterShareButton>
                  <LinkedinShareButton
                    url={`${url_retrival_base_url}/${linkInfo?.shortened_url_cuid}`}
                  >
                    <LinkedinIcon borderRadius={8} size={32} />
                  </LinkedinShareButton>
                  <EmailShareButton
                    url={`${url_retrival_base_url}/${linkInfo?.shortened_url_cuid}`}
                  >
                    <EmailIcon size={32} borderRadius={8} />
                  </EmailShareButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LinkShareModal;

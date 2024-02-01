interface Props {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  linkInfo: StatsPopulatedShortnedUrl;
}

import Modal from "./Modal";
import { Dispatch, SetStateAction, useRef } from "react";
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
import { url_retrival_base_url } from "../../utils/base_url";
import AvatarImage from "../Global/AvatarImage";
import { StatsPopulatedShortnedUrl } from "../../pages/Links";
import useCopyToClipboard from "../../hooks/useCopyToClipboard";

const LinkShareModal = ({ isModalOpen, setIsModalOpen, linkInfo }: Props) => {
  const copyBtnRef = useRef<HTMLButtonElement>(null);
  const { copyToClipboard } = useCopyToClipboard();
  return (
    <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
      <div>
        <div className="flex gap-x-2 items-center mt-4 mb-2">
          <AvatarImage
            diameter={"45px"}
            url={`https://www.google.com/s2/favicons?domain=${linkInfo?.original_url}&sz=40`}
          />
          <h2 className="text-2xl ml-2 max-w-[25ch]">{linkInfo?.link_title}</h2>
        </div>
        <a href={linkInfo?.original_url} className="underline" target="_blank">
          {linkInfo?.original_url}
        </a>
      </div>
      <div className="flex items-center gap-x-6 my-6">
        <div>
          <button
            ref={copyBtnRef}
            onClick={async (btn) => {
              const link = `${url_retrival_base_url}/${linkInfo?.shortend_url_cuid}`;
              await copyToClipboard(link);
              copyBtnRef.current!.innerText = "Copied!";
              setTimeout(() => {
                copyBtnRef.current!.innerText = "Copy Link";
              }, 1000);
            }}
            className="px-5 bg-neutral-200 rounded-full py-2 hover:bg-neutral-400 duration-200"
            aria-label="btn_Copy"
          >
            Copy Link
          </button>
        </div>
        <div className="flex gap-x-3">
          <FacebookShareButton
            windowWidth={700}
            windowHeight={700}
            aria-label="btn_Facebook"
            url={`${url_retrival_base_url}/${linkInfo?.shortend_url_cuid}`}
          >
            <FacebookIcon round size={35} />
          </FacebookShareButton>
          <TwitterShareButton
            aria-label="btn_Twitter"
            url={`${url_retrival_base_url}/${linkInfo?.shortend_url_cuid}`}
          >
            <XIcon borderRadius={8} size={32} />
          </TwitterShareButton>
          <LinkedinShareButton
            aria-label="btn_Linkedin"
            url={`${url_retrival_base_url}/${linkInfo?.shortend_url_cuid}`}
          >
            <LinkedinIcon borderRadius={8} size={32} />
          </LinkedinShareButton>
          <EmailShareButton
            aria-label="btn_Mail"
            url={`${url_retrival_base_url}/${linkInfo?.shortend_url_cuid}`}
          >
            <EmailIcon size={32} borderRadius={8} />
          </EmailShareButton>
        </div>
      </div>
    </Modal>
  );
};

export default LinkShareModal;

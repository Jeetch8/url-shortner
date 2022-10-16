import React, { useCallback, useEffect, useRef, useState } from "react";
import { MdEdit } from "react-icons/md";
import { base_url } from "../utils/base_url";
import { useFetch } from "../hooks/useFetch";
import { compareChangedDiffObjectValues } from "../utils/compareObject";
import ReactLoading from "react-loading";

const EditLinkModal = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);
  const blackScreenRef = useRef(null);
  const [linkInfo, setLinkInfo] = useState({
    original_url: data.original_url,
    shortened_url_cuid: data.shortened_url_cuid,
    link_title: data.link_title,
  });
  const { fetchState, doFetch } = useFetch({
    url: base_url + "/url/edit/" + data._id,
    method: "PUT",
    authorized: true,
    onSuccess: () => {
      setIsOpen(false);
    },
  });

  const handleClickOutside = useCallback((event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);

    return () =>
      document.removeEventListener("click", handleClickOutside, true);
  }, []);

  const handleFiedlsChange = (e) => {
    setLinkInfo((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSubmitLinkEdites = async () => {
    const obj = compareChangedDiffObjectValues({
      intialObj: data,
      changedObj: linkInfo,
    });
    if (obj) {
      await doFetch(obj);
    } else setIsOpen(false);
  };

  return (
    <>
      <button
        className="p-1 hover:bg-[rgba(0,0,0,0.1)] h-fit cursor-pointer rounded-md"
        onClick={() => setIsOpen(true)}
      >
        <MdEdit />
      </button>
      {isOpen && (
        <div
          className="h-full w-full top-0 left-0 absolute bg-[rgba(0,0,0,0.2)] flex items-center justify-center"
          ref={blackScreenRef}
        >
          <div className="bg-white rounded-md px-6 py-6" ref={modalRef}>
            <h2 className="text-left text-xl font-semibold">Edit Short URL</h2>
            <div className="border-[1px] border-black flex items-baseline rounded-sm mt-4">
              <p
                className="px-4 py-2 bg-zinc-400 text-white rounded-sm"
                htmlFor="shortened_url_cuid"
              >
                Link Title
              </p>
              <input
                className="min-w-[320px] px-2 outline-none"
                type="text"
                name="link_title"
                value={linkInfo?.link_title}
                onChange={handleFiedlsChange}
              />
            </div>
            <div className="border-[1px] border-black flex items-baseline rounded-sm mt-4">
              <p
                className="px-4 py-2 bg-zinc-400 text-white rounded-sm"
                htmlFor="link_title"
              >
                Link slug
              </p>
              <input
                className="min-w-[320px] px-2 outline-none"
                type="text"
                name="shortened_url_cuid"
                value={linkInfo.shortened_url_cuid}
                onChange={handleFiedlsChange}
              />
            </div>
            <div className="border-[1px] border-black flex items-baseline rounded-sm mt-5">
              <p
                className="px-4 py-2 bg-zinc-400 text-white rounded-sm"
                htmlFor="original_url"
              >
                Original URL
              </p>
              <input
                className="min-w-[320px] px-2 outline-none"
                type="text"
                name="original_url"
                value={linkInfo.original_url}
                onChange={handleFiedlsChange}
              />
            </div>
            <div className="flex justify-end gap-x-2 mt-6">
              <button
                className="bg-blue-400 text-white px-4 py-2 rounded-md"
                onClick={handleSubmitLinkEdites}
                disabled={fetchState === "loading"}
              >
                {fetchState === "loading" ? <ReactLoading /> : "Save"}
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={() => setIsOpen(false)}
                disabled={fetchState === "loading"}
              >
                {fetchState === "loading" ? <ReactLoading /> : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditLinkModal;

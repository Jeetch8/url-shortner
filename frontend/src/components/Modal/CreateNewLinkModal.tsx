import { base_url } from "../../utils/base_url";
import { useFetch } from "../../hooks/useFetch";
import ScaleLoader from "react-spinners/ScaleLoader";
import { useForm } from "react-hook-form";
import { useSidebarContext } from "../../context/SidebarContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BsInfoCircle } from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import { twMerge } from "tailwind-merge";
import { BiSolidLockOpenAlt } from "react-icons/bi";
import { GiNinjaMask } from "react-icons/gi";
import Modal from "./Modal";

const CreateNewLinkModal = () => {
  const { isModalOpen, setIsModalOpen } = useSidebarContext();
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    reset,
    getValues,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      original_url: "",
      passwordProtected: {
        isPasswordProtected: false,
        password: "",
      },
      link_cloaking: false,
    },
  });
  const { fetchState, doFetch } = useFetch({
    url: base_url + "/url/createLink",
    method: "POST",
    authorized: true,
    onSuccess: (data) => {
      toast.success(data.msg);
      setTimeout(() => {
        setIsModalOpen(false);
        reset({});
        navigate("/links/" + data.link.slug);
      }, 2000);
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const handleSubmitShortenNewLink = async (e: any) => {
    const data = { ...e };
    if (
      !e.passwordProtected.password ||
      e.passwordProtected.password === undefined
    )
      data.passwordProtected.password = null;
    await doFetch(data);
  };

  return (
    <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
      <form onSubmit={handleSubmit(handleSubmitShortenNewLink)}>
        <h2 className="text-left text-2xl font-semibold mt-3 mb-5">
          Create new shrotend link
        </h2>
        <div className="px-4 py-4">
          <div>
            <label htmlFor="original_url" className="font-semibold mb-1">
              Destination Url
            </label>
            <br />
            <input
              {...register("original_url", {
                pattern: {
                  value:
                    /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi,
                  message: "Provided url is not valid",
                },
              })}
              type="text"
              className="border-2 border-neutral-400 rounded-md px-4 py-1 outline-blue-400 w-full text-xl"
            />
            <p className="text-red-600 font-semibold text-sm">
              {errors.original_url?.message}
            </p>
          </div>
          <div className="mt-5">
            <label htmlFor="passwordProtected.isPasswordProtected">
              <span className="mr-2">
                <BiSolidLockOpenAlt className="inline mb-1" size={20} />
                Password protected
                <a
                  className="inline-block ml-2 w-fit"
                  data-tooltip-id="password_protected_info"
                  data-tooltip-content={
                    "Shortend url visitor will be asked for password before redirecting to the original url"
                  }
                  data-tooltip-place="top"
                >
                  <BsInfoCircle size={13} color="grey" />
                </a>
              </span>
              <input
                type="checkbox"
                id="passwordProtected.isPasswordProtected"
                {...register("passwordProtected.isPasswordProtected")}
              />
            </label>
            <Tooltip
              id="password_protected_info"
              style={{
                fontSize: 13,
              }}
            />
            <div
              className={twMerge(
                "mt-4",
                !watch("passwordProtected.isPasswordProtected") && "hidden"
              )}
            >
              <label htmlFor="passwordProtected.password">Password</label>
              <input
                className="outline-blue-300 px-4 py-1 border-2 border-neutral-400 rounded-lg ml-2"
                type="text"
                id="passwordProtected.password"
                {...register("passwordProtected.password", {
                  required: {
                    value: getValues("passwordProtected.isPasswordProtected"),
                    message: "Password is required",
                  },
                  pattern: {
                    value:
                      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                    message:
                      "Password must be atleast 8 characters and should contain 1 uppercase letter, 1 lowercase letter, and 1 number",
                  },
                  maxLength: {
                    value: 10,
                    message: "Password should be less than 10 characters",
                  },
                })}
              />
              <p className="text-red-600 font-semibold text-sm">
                {errors.passwordProtected?.password?.message}
              </p>
            </div>
            <div className="mt-4">
              <label htmlFor="link_cloaking">
                <span className="mr-2">
                  <GiNinjaMask className="inline mb-1" size={22} /> Link
                  Cloaking
                  <a
                    className="inline-block ml-2 w-fit"
                    data-tooltip-id="password_protected_info"
                    data-tooltip-content={
                      "Hide's the destination address of this link by opening it in an iFrame."
                    }
                    data-tooltip-place="top"
                  >
                    <BsInfoCircle size={13} color="grey" />
                  </a>
                </span>
                <input
                  type="checkbox"
                  id="link_cloaking"
                  {...register("link_cloaking")}
                />
              </label>
              <Tooltip
                id="password_protected_info"
                style={{
                  fontSize: 13,
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-x-2 mt-6">
          <button
            className="bg-white border-2 border-black text-black px-4 py-2 rounded-full disabled:bg-neutral-400 disabled:border-white disabled:text-white hover:bg-neutral-200"
            disabled={fetchState === "loading" || !isDirty}
            type="submit"
          >
            {fetchState === "loading" ? (
              <ScaleLoader height={15} color="black" className="px-5" />
            ) : (
              <span className="px-[3px]">Create link</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateNewLinkModal;

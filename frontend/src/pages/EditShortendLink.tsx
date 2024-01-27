type Leaves<T> = T extends object
  ? {
      [K in keyof T]: `${Exclude<K, symbol>}${Leaves<T[K]> extends never
        ? ""
        : `.${Leaves<T[K]>}`}`;
    }[keyof T]
  : never;

const FormDefaultValues = {
  link_title: "",
  link_description: "",
  original_url: "",
  link_enabled: false,
  shortend_url_cuid: "",
  link_cloaking: false,
  sharing_preview: {
    enabeld: false,
    title: "",
    description: "",
    image: "",
  },
  protected: {
    enabled: false,
    password: "",
  },
  link_expiry: {
    enabled: false,
    expiryDateAndTime: "",
    expiryRedirectUrl: "",
  },
  link_targetting: {
    enabled: false,
    location: {
      country: "",
      redirect_url: "",
    },
    device: {
      android: "",
      ios: "",
      windows: "",
      linux: "",
      mac: "",
    },
    rotate: [],
  },
};

import { toast } from "react-hot-toast";
import { useFetch } from "@/hooks/useFetch";
import { base_url } from "@/utils/base_url";
import { useForm, Controller, FieldErrors } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { twMerge } from "tailwind-merge";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { Tooltip } from "react-tooltip";
import { BsInfoCircle } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { Tabs, Tab, TabList, TabPanel } from "react-tabs";
import CountriesList from "@/assets/CountryList.json";
import { ShortendUrl } from "@shared/types/mongoose-types";
import { useEffect } from "react";
import { useUserContext } from "@/context/UserContext";
import { IoLockClosed } from "react-icons/io5";
import { Link } from "react-router-dom";

const UrlValidationRegex =
  /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

const inputClass =
  "outline-blue-300 px-4 py-1 border-2 border-neutral-300 rounded-lg";

export const ErrorComp = ({
  error,
  name,
}: {
  error: FieldErrors<Leaves<typeof FormDefaultValues>>;
  name: Leaves<typeof FormDefaultValues>;
}) => {
  const errorMsg = error[name]?.message as string | undefined;
  return <p className="text-red-600 font-semibold text-sm">{errorMsg}</p>;
};

export const UpgradeRequiredTooltip = () => {
  return (
    <>
      <a id="upgrade_required" className="ml-2">
        <IoLockClosed size={16} />
      </a>
      <Tooltip anchorSelect="#upgrade_required" clickable>
        <Link to={"/subscribe"} className="underline">
          Upgrade
        </Link>
        <span> required to use this feature</span>
      </Tooltip>
    </>
  );
};

const CreateShortendLink = () => {
  const { user } = useUserContext();
  const { linkId } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    control,
    watch,
    setValue,
    reset,
    formState: { isDirty, errors },
  } = useForm({ defaultValues: FormDefaultValues });
  const {} = useFetch({
    url: base_url + "/url/createLink",
    method: "POST",
    authorized: true,
    onSuccess: (res) => {
      toast.success("Link Generated");
      navigate("/links/" + res.link._id);
    },
    onError: (err) => {
      toast.error("Error generating link");
      console.log(err);
    },
  });

  const { doFetch: fetchLinkDetails } = useFetch<{
    link: ShortendUrl;
    data: any;
  }>({
    url: base_url + "/url/" + linkId,
    authorized: true,
    method: "GET",
    onSuccess(data) {
      reset(data.data);
    },
  });

  useEffect(() => {
    fetchLinkDetails();
  }, []);

  const onSubmit = async (e: any) => {
    console.log(e);
    return true;
    // if (userInput !== undefined || userInput !== "") {
    //   await FetchNewLink({
    //   });
    // }
  };

  return (
    <div className="max-w-[1600px] my-5 py-5 px-5 rounded-lg w-full bg-white mx-auto">
      <h2 className="text-3xl font-semibold">Edit Link</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-end mt-4">
          <button
            className="bg-blue-600 px-4 py-2 rounded-md text-white mr-6 disabled:bg-blue-950"
            disabled={!isDirty}
          >
            Save changes
          </button>
        </div>
        <table className="mt-6 [&_:where(td)]:py-4">
          <tbody>
            <tr>
              <td className="w-[400px]">
                <label htmlFor="original_url">Original Link</label>
              </td>
              <td>
                <input
                  {...register("original_url", {
                    required: {
                      value: true,
                      message: "URL is required",
                    },
                    pattern: {
                      value: UrlValidationRegex,
                      message: "Invalid URL",
                    },
                  })}
                  className={inputClass}
                  type="text"
                />
                <ErrorComp error={errors} name={"original_url"} />
              </td>
            </tr>
            <tr>
              <td>Slug</td>
              <td>
                <input
                  type="text"
                  id="slug"
                  className={inputClass}
                  {...register("shortend_url_cuid", {
                    minLength: {
                      value: 6,
                      message: "Min length is 6",
                    },
                    maxLength: {
                      value: 6,
                      message: "Max length is 6",
                    },
                  })}
                />
                <ErrorComp error={errors} name={"shortend_url_cuid"} />
              </td>
            </tr>
            <tr>
              <td>
                <p className=" flex items-center">
                  Link enabled
                  <a
                    className="inline-block ml-2 w-fit"
                    data-tooltip-id="link_enabled_info"
                    data-tooltip-content={
                      "If link is disabled the user will be redirected to a 404 default page if not provided"
                    }
                    data-tooltip-place="top-start"
                  >
                    <BsInfoCircle size={13} color="grey" />
                  </a>
                </p>
                <Tooltip
                  place="top-start"
                  id="link_enabled_info"
                  positionStrategy="absolute"
                />
              </td>
              <td>
                <label htmlFor="link_enabled">
                  <input type="checkbox" {...register("link_enabled")} />
                </label>
              </td>
            </tr>
            <tr>
              <td>
                <p className=" flex items-center">
                  Password protected
                  <a
                    className="inline-block ml-2 w-fit"
                    data-tooltip-id="password_protected_info"
                    data-tooltip-content={
                      "Shortend url visitor will be asked for password before redirecting to the original url"
                    }
                    data-tooltip-place="top-start"
                  >
                    <BsInfoCircle size={13} color="grey" />
                  </a>
                  <Tooltip
                    place="top-start"
                    id="password_protected_info"
                    positionStrategy="absolute"
                  />
                  <UpgradeRequiredTooltip />
                </p>
                {!user?.product.features.link_password_protection && (
                  <Tooltip place="top-start" id="upgrade_required" />
                )}
              </td>
              <td>
                <label htmlFor="passwordProtected.isPasswordProtected">
                  <input
                    type="checkbox"
                    {...register("protected.enabled", {
                      disabled:
                        !user?.product.features.link_password_protection,
                    })}
                  />
                </label>
              </td>
            </tr>
            <tr className={twMerge(!watch("protected.enabled") && "hidden")}>
              <td>
                <label htmlFor="password">Password :</label>
              </td>
              <td>
                <input
                  disabled={!watch("protected.enabled")}
                  {...register("protected.password", {
                    required: {
                      value: getValues("protected.enabled"),
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
                  type="password"
                  id="passwordProtected.password"
                  name="passwordProtected.password"
                  className={twMerge(inputClass, "disabled:cursor-not-allowed")}
                />
                <ErrorComp error={errors} name={"protected.password"} />
              </td>
            </tr>
            <tr>
              <td>
                <p className=" flex items-center">
                  Link Cloaking
                  <a
                    className="inline-block ml-2 w-fit"
                    data-tooltip-id="link_cloaking_info"
                    data-tooltip-content={
                      "Hide's the destination address of this link by opening it in an iFrame."
                    }
                    data-tooltip-place="top-start"
                  >
                    <BsInfoCircle size={13} color="grey" />
                  </a>
                  {!user?.product.features.link_cloaking && (
                    <UpgradeRequiredTooltip />
                  )}
                </p>
                <Tooltip place="top-start" id="link_cloaking_info" />
              </td>
              <td>
                <label htmlFor="link_cloaking">
                  <input
                    {...register("link_cloaking", {
                      disabled: !user?.product.features.link_cloaking,
                    })}
                    type="checkbox"
                    name="link_cloaking"
                    id="link_cloaking"
                  />
                </label>
              </td>
            </tr>
            <tr>
              <td className="flex items-center gap-x-1">
                <span className="inline-block">Link Expiry</span>{" "}
                {!user?.product.features.link_expiration && (
                  <UpgradeRequiredTooltip />
                )}
              </td>
              <td>
                <label htmlFor="link_expiry.doesExpires">
                  <input
                    {...register("link_expiry.enabled", {
                      disabled: !user?.product.features.link_expiration,
                    })}
                    type="checkbox"
                    id="link_expiry.doesExpires"
                    name="link_expiry.doesExpires"
                  />
                </label>
              </td>
            </tr>
            <tr className={twMerge(!watch("link_expiry.enabled") && "hidden")}>
              <td>
                <label htmlFor="link_expiry.expiryDateAndTime">
                  Expiry Date And Time:
                </label>
              </td>
              <td>
                <Controller
                  rules={{
                    required: {
                      value: getValues("link_expiry.enabled"),
                      message: "Valid expiry date and time is required",
                    },
                  }}
                  control={control}
                  name="link_expiry.expiryDateAndTime"
                  render={({ field: { onChange, value } }) => (
                    <DateTimePicker onChange={onChange} value={value} />
                  )}
                />
                <ErrorComp
                  error={errors}
                  name={"link_expiry.expiryDateAndTime"}
                />
              </td>
            </tr>
            <tr className={twMerge(!watch("link_expiry.enabled") && "hidden")}>
              <td>
                <label htmlFor="link_expiry.expiryRedirectUrl">
                  Expriy destination:
                </label>
              </td>
              <td>
                <input
                  className={inputClass}
                  {...register("link_expiry.expiryRedirectUrl", {
                    pattern: {
                      value: UrlValidationRegex,
                      message: "Input is not an URL",
                    },
                  })}
                />
                <ErrorComp
                  error={errors}
                  name={"link_expiry.expiryRedirectUrl"}
                />
              </td>
            </tr>
            <tr>
              <td>Targeting</td>
              <td>
                <Tabs>
                  <TabList className={"flex items-cente gap-x-2"}>
                    <Tab className="border-[1px] border-neutral-400 w-fit px-4 py-1 rounded-md cursor-pointer">
                      None
                    </Tab>
                    <Tab className="border-[1px] border-neutral-400 w-fit px-4 py-1 rounded-md cursor-pointer">
                      Location
                    </Tab>
                    <Tab className="border-[1px] border-neutral-400 w-fit px-4 py-1 rounded-md cursor-pointer">
                      Device
                    </Tab>
                    <Tab className="border-[1px] border-neutral-400 w-fit px-4 py-1 rounded-md cursor-pointer">
                      Rotate
                    </Tab>
                  </TabList>
                  <TabPanel>
                    <></>
                  </TabPanel>
                  <TabPanel>
                    <div className="mt-4">
                      <select
                        className="w-[300px] mb-4 px-2 py-2"
                        name="countries"
                        id="countries"
                        defaultValue={"IN"}
                      >
                        {CountriesList.countries.map((el) => {
                          return (
                            <option value={el.countryCode} key={el.countryCode}>
                              {el.flag} {el.country}
                            </option>
                          );
                        })}
                      </select>
                      <br />
                      <label
                        htmlFor="targeting.location.redirect_url"
                        className="mr-4"
                      >
                        Destination URL:
                      </label>
                      <input
                        type="text"
                        {...register("link_targetting.location.redirect_url", {
                          pattern: {
                            value: UrlValidationRegex,
                            message: "Provided URL is not valid",
                          },
                        })}
                        className={inputClass}
                      />
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <table>
                      <tbody className="[&_:where(td)]:py-2">
                        <tr>
                          <td>
                            <label htmlFor="targeting.device.android">
                              Android
                            </label>
                          </td>
                          <td>
                            <input
                              type="text"
                              className={inputClass}
                              {...register("link_targetting.device.android", {
                                pattern: {
                                  value: UrlValidationRegex,
                                  message: "Provided URL is not valid",
                                },
                              })}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <label htmlFor="targeting.device.ios">ios</label>
                          </td>
                          <td>
                            <input
                              type="text"
                              className={inputClass}
                              {...register("link_targetting.device.ios", {
                                pattern: {
                                  value: UrlValidationRegex,
                                  message: "Provided URL is not valid",
                                },
                              })}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <label htmlFor="targeting.device.windows">
                              windows
                            </label>
                          </td>
                          <td>
                            <input
                              type="text"
                              className={inputClass}
                              {...register("link_targetting.device.windows", {
                                pattern: {
                                  value: UrlValidationRegex,
                                  message: "Provided URL is not valid",
                                },
                              })}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <label htmlFor="link_targetting.device.linux">
                              linux
                            </label>
                          </td>
                          <td>
                            <input
                              type="text"
                              className={inputClass}
                              {...register("link_targetting.device.linux", {
                                pattern: {
                                  value: UrlValidationRegex,
                                  message: "Provided URL is not valid",
                                },
                              })}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <label htmlFor="link_targetting.device.mac">
                              mac
                            </label>
                          </td>
                          <td>
                            <input
                              type="text"
                              className={inputClass}
                              {...register("link_targetting.device.mac", {
                                pattern: {
                                  value: UrlValidationRegex,
                                  message: "Provided URL is not valid",
                                },
                              })}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </TabPanel>
                  <TabPanel>Rotate</TabPanel>
                </Tabs>
              </td>
            </tr>
            <tr>
              <td className="flex items-center gap-x-1">
                Custom Link Preview{" "}
                {!user?.product.features.custom_link_sharing_preview && (
                  <UpgradeRequiredTooltip />
                )}
              </td>
              <td>
                <label htmlFor="custom_link_preview">
                  <input
                    {...register("sharing_preview.enabeld", {
                      disabled:
                        !user?.product.features.custom_link_sharing_preview,
                    })}
                    type="checkbox"
                  />
                </label>
              </td>
            </tr>
            <tr
              className={twMerge(!watch("sharing_preview.enabeld") && "hidden")}
            >
              <td>
                <label htmlFor="link_preview.title">Title</label>
              </td>
              <td>
                <input
                  {...register("sharing_preview.title", {
                    minLength: {
                      value: 30,
                      message: "Title min length is 30",
                    },
                    maxLength: {
                      value: 60,
                      message: "Max length is 60",
                    },
                  })}
                  type="text"
                  className="mt-2 border-2 outline-none rounded-md ml-2 px-2 py-1"
                />
                <ErrorComp error={errors} name={"sharing_preview.title"} />
              </td>
            </tr>
            <tr
              className={twMerge(!watch("sharing_preview.enabeld") && "hidden")}
            >
              <td>
                <label htmlFor="link_preview.description">Description</label>
              </td>
              <td>
                <input
                  {...register("sharing_preview.description", {
                    minLength: {
                      value: 55,
                      message: "Min length is 55",
                    },
                    maxLength: {
                      value: 200,
                      message: "Max lenght is 200",
                    },
                  })}
                  type="text"
                  className="mt-2 border-2 outline-none rounded-md ml-2 px-2 py-1"
                />
                <ErrorComp
                  error={errors}
                  name={"sharing_preview.description"}
                />
              </td>
            </tr>
            <tr
              className={twMerge(!watch("sharing_preview.enabeld") && "hidden")}
            >
              <td>
                <label htmlFor="link_preview.image">Image</label>
              </td>
              <td>
                <input {...register("sharing_preview.image")} type="file" />
              </td>
            </tr>
          </tbody>
        </table>
        {watch("sharing_preview.enabeld") && (
          <div className="border-2 w-fit mt-4 min-w-[350px] rounded-md">
            {watch("sharing_preview.image") && (
              <div
                style={{
                  backgroundImage: `url(${watch("sharing_preview.image")})`,
                  width: "400px",
                  height: "200px",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              ></div>
            )}
            <div className="px-4 py-2 max-w-[600px] w-full">
              <div
                className="w-full h-[300px] border-2"
                style={{
                  backgroundImage: watch("sharing_preview.image"),
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "fit",
                }}
              ></div>
              <h4 className="font-semibold mt-2">
                {watch("sharing_preview.title") ?? "Title"}
              </h4>
              <p className="mt-2">
                {watch("sharing_preview.description") ?? "Description"}
              </p>
            </div>
          </div>
        )}
      </form>
      <DevTool control={control} />
    </div>
  );
};

export default CreateShortendLink;

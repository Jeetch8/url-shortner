import React from "react";
import { toast } from "react-hot-toast";
import { useFetch } from "../hooks/useFetch";
import { base_url } from "../utils/base_url";
import { useForm, Controller } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { twMerge } from "tailwind-merge";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { Tooltip } from "react-tooltip";
import { BsInfoCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { Tabs, Tab, TabList, TabPanel } from "react-tabs";
import CountriesList from "../assets/CountryList.json";

export const ErrorComp = ({ error, name }) => {
  return (
    <p className="text-red-600 font-semibold text-sm">{error[name]?.message}</p>
  );
};
const UrlValidationRegex =
  /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

const inputClass =
  "outline-blue-300 px-4 py-1 border-2 border-neutral-300 rounded-lg";

const CreateShortendLink = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    control,
    watch,
    getFieldState,
    formState: { isDirty, isValid, errors },
  } = useForm({
    defaultValues: {
      original_url: null,
      link_enabled: false,
      slug: null,
      link_cloaking: false,
      link_preview: {
        custom_link_preview: false,
        title: null,
        description: null,
        image: null,
      },
      passwordProtected: {
        isPasswordProtected: false,
        password: null,
      },
      link_expiry: {
        doesExpires: false,
        expiryDateAndTime: "",
        expiryRedirectUrl: "",
      },
      targeting: {
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
      },
    },
  });
  const { fetchState: newLinkFetchState, doFetch: FetchNewLink } = useFetch({
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

  const onSubmit = async (e) => {
    console.log(e);
    return true;
    // if (userInput !== undefined || userInput !== "") {
    //   await FetchNewLink({
    //   });
    // }
  };

  return (
    <div className="max-w-[1600px] my-5 py-5 px-5 rounded-lg w-full bg-white mx-auto">
      <h2 className="text-3xl font-semibold">Create New Link</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-end mt-4">
          <button
            className="bg-blue-600 px-4 py-2 rounded-md text-white mr-6 disabled:bg-blue-950"
            disabled={!isDirty}
          >
            Create Link
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
                  name="slug"
                  id="slug"
                  className={inputClass}
                  {...register("slug", {
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
                <ErrorComp error={errors} name={"slug"} />
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
                    data-tooltip-place="top"
                  >
                    <BsInfoCircle size={13} color="grey" />
                  </a>
                </p>
                <Tooltip id="link_enabled_info" />
              </td>
              <td>
                <label htmlFor="link_enabled">
                  <input
                    type="checkbox"
                    name="link_enabled"
                    id="link_enabled"
                    {...register("link_enabled")}
                  />
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
                    data-tooltip-place="top"
                  >
                    <BsInfoCircle size={13} color="grey" />
                  </a>
                </p>
                <Tooltip id="password_protected_info" />
              </td>
              <td>
                <label htmlFor="passwordProtected.isPasswordProtected">
                  <input
                    type="checkbox"
                    name="passwordProtected.isPasswordProtected"
                    id="passwordProtected.isPasswordProtected"
                    {...register("passwordProtected.isPasswordProtected")}
                  />
                </label>
              </td>
            </tr>
            <tr
              className={twMerge(
                !watch("passwordProtected.isPasswordProtected") && "hidden"
              )}
            >
              <td>
                <label htmlFor="password">Password :</label>
              </td>
              <td>
                <input
                  disabled={!watch("passwordProtected.isPasswordProtected")}
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
                  type="password"
                  id="passwordProtected.password"
                  name="passwordProtected.password"
                  className={twMerge(inputClass, "disabled:cursor-not-allowed")}
                />
                <ErrorComp error={errors} name={"passwordProtected.password"} />
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
                    data-tooltip-place="top"
                  >
                    <BsInfoCircle size={13} color="grey" />
                  </a>
                </p>
                <Tooltip id="link_cloaking_info" />
              </td>
              <td>
                <label htmlFor="link_cloaking">
                  <input
                    {...register("link_cloaking")}
                    type="checkbox"
                    name="link_cloaking"
                    id="link_cloaking"
                  />
                </label>
              </td>
            </tr>
            <tr>
              <td>Link Expiry</td>
              <td>
                <label htmlFor="link_expiry.doesExpires">
                  <input
                    {...register("link_expiry.doesExpires")}
                    type="checkbox"
                    id="link_expiry.doesExpires"
                    name="link_expiry.doesExpires"
                  />
                </label>
              </td>
            </tr>
            <tr
              className={twMerge(!watch("link_expiry.doesExpires") && "hidden")}
            >
              <td>
                <label htmlFor="link_expiry.expiryDateAndTime">
                  Expiry Date And Time:
                </label>
              </td>
              <td>
                <Controller
                  rules={{
                    required: {
                      value: getValues("link_expiry.doesExpires"),
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
            <tr
              className={twMerge(!watch("link_expiry.doesExpires") && "hidden")}
            >
              <td>
                <label htmlFor="link_expiry.expiryRedirectUrl">
                  Expriy destination:
                </label>
              </td>
              <td>
                <input
                  className={inputClass}
                  name="link_expiry.expiryRedirectUrl"
                  id="link_expiry.expiryRedirectUrl"
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
                        name="targeting.location.redirect_url"
                        id="targeting.location.redirect_url"
                        {...register("targeting.location.redirect_url", {
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
                              name="targeting.device.android"
                              id="targeting.device.android"
                              className={inputClass}
                              {...register("targeting.device.android", {
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
                              name="targeting.device.ios"
                              id="targeting.device.ios"
                              className={inputClass}
                              {...register("targeting.device.ios", {
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
                              name="targeting.device.windows"
                              id="targeting.device.windows"
                              className={inputClass}
                              {...register("targeting.device.windows", {
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
                            <label htmlFor="targeting.device.linux">
                              linux
                            </label>
                          </td>
                          <td>
                            <input
                              type="text"
                              name="targeting.device.linux"
                              id="targeting.device.linux"
                              className={inputClass}
                              {...register("targeting.device.linux", {
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
                            <label htmlFor="targeting.device.mac">mac</label>
                          </td>
                          <td>
                            <input
                              type="text"
                              name="targeting.device.mac"
                              id="targeting.device.mac"
                              className={inputClass}
                              {...register("targeting.device.mac", {
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
              <td>Custom Link Preview</td>
              <td>
                <label htmlFor="custom_link_preview">
                  <input
                    {...register("link_preview.custom_link_preview")}
                    type="checkbox"
                    name="link_preview.custom_link_preview"
                    id="link_preview.custom_link_preview"
                  />
                </label>
              </td>
            </tr>
            <tr
              className={twMerge(
                !watch("link_preview.custom_link_preview") && "hidden"
              )}
            >
              <td>
                <label htmlFor="link_preview.title">Title</label>
              </td>
              <td>
                <input
                  {...register("link_preview.title", {
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
                  id="link_preview.title"
                  name="link_preview.title"
                  className="mt-2 border-2 outline-none rounded-md ml-2 px-2 py-1"
                />
                <ErrorComp error={errors} name={"link_preview.title"} />
              </td>
            </tr>
            <tr
              className={twMerge(
                !watch("link_preview.custom_link_preview") && "hidden"
              )}
            >
              <td>
                <label htmlFor="link_preview.description">Description</label>
              </td>
              <td>
                <input
                  {...register("link_preview.description", {
                    minLength: {
                      value: 55,
                      message: "Min length is 55",
                    },
                    maxLength: {
                      value: 200,
                      message: "Max lenght is 200",
                    },
                  })}
                  name="link_preview.description"
                  type="text"
                  id="link_preview.description"
                  className="mt-2 border-2 outline-none rounded-md ml-2 px-2 py-1"
                />
                <ErrorComp error={errors} name={"link_preview.description"} />
              </td>
            </tr>
            <tr
              className={twMerge(
                !watch("link_preview.custom_link_preview") && "hidden"
              )}
            >
              <td>
                <label htmlFor="link_preview.image">Image</label>
              </td>
              <td>
                <input
                  {...register("link_preview.image")}
                  type="file"
                  name="link_preview.image"
                  id="link_preview.image"
                />
              </td>
            </tr>
          </tbody>
        </table>
        {watch("link_preview.custom_link_preview") && (
          <div className="border-2 w-fit mt-4 min-w-[350px] rounded-md">
            {watch("link_preview.image") && (
              <div
                style={{
                  backgroundImage: `url(${watch("link_preview.image")})`,
                  width: "400px",
                  height: "200px",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              ></div>
            )}
            <div className="px-4 py-2">
              <h4 className="font-semibold">
                {watch("link_preview.title") ?? "Title"}
              </h4>
              <p className="mt-2">
                {watch("link_preview.description") ?? "Description"}
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

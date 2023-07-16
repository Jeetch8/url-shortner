import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useFetch } from "../hooks/useFetch";
import { base_url } from "../utils/base_url";
import ReactLoading from "react-loading";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

const CreateShortendLink = ({ fetchGeneratedLinks }) => {
  const {
    register,
    handleSubmit,
    getValues,
    control,
    getFieldState,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      original_url: null,
      link_cloacking: false,
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
    },
  });
  const { fetchState: newLinkFetchState, doFetch: FetchNewLink } = useFetch({
    url: base_url + "/url/createLink",
    method: "POST",
    authorized: true,
    onSuccess: () => {
      setUserInput("");
      toast.success("Link Generated");
      fetchGeneratedLinks();
      setIsLinkCloaked(false);
    },
    onError: (err) => {
      toast.error("Error generating link");
      console.log(err);
      setIsLinkCloaked(false);
    },
  });

  const onSubmit = async () => {
    if (userInput !== undefined || userInput !== "") {
      await FetchNewLink({
        original_url: userInput,
        link_cloaking: isLinkCloaked,
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex border-[1px] my-4 mx-auto w-fit rounded-md">
          <input
            {...register("original_url", {
              required: {
                value: true,
                message: "URL is required",
              },
              pattern: {
                value:
                  /^(https?|ftp):\/\/(-\.)?([^\s/?\.#-]+\.?)+(\/[^\s]*)?$/i,
                message: "Invalid URL",
              },
            })}
            className="outline-none px-2"
            type="text"
          />
        </div>
        <div className="py-2 px-2 m-6">
          <label htmlFor="link_cloaking">
            <input {...register("link_cloacking")} type="checkbox" />
            Link Cloaking
          </label>
        </div>
        <div className="ml-6">
          <label htmlFor="custom_link_preview">
            <input
              {...register("link_preview.custom_link_preview")}
              type="checkbox"
            />
            Custom Link Preview
          </label>
          {getValues("link_preview.custom_link_preview") && (
            <div>
              <label htmlFor="preview_title">Title</label>
              <input
                {...register("link_preview.title")}
                type="text"
                id="preview_title"
                name="preview_title"
                className="mt-2 border-2 outline-none rounded-md ml-2 px-2 py-1"
              />
              <br />
              <label htmlFor="preview_description">Description</label>
              <input
                {...register("link_preview.description")}
                name="preview_description"
                type="text"
                id="preview_description"
                className="mt-2 border-2 outline-none rounded-md ml-2 px-2 py-1"
              />
              <br />
              <label htmlFor="preview_image">Image</label>
              <input
                {...register("link_preview.image")}
                type="file"
                name="preview_image"
                id="preview_image"
              />
            </div>
          )}
        </div>
        <div className="py-2 px-2 m-4">
          <label htmlFor="isPasswordProtected">
            <input
              type="checkbox"
              {...register("passwordProtected.isPasswordProtected")}
            />
            Password protected
          </label>
          {getValues("passwordProtected.isPasswordProtected") && (
            <div>
              <label htmlFor="password">Password :</label>
              <input
                {...register("passwordProtected.password", {
                  required: {
                    value: getValues("isPasswordProtected"),
                    message: "Password is required",
                  },
                  minLength: {
                    value: 6,
                    message: "Password must be atleast 6 characters",
                  },
                })}
                type="password"
                id="password"
                className="mt-2 border-2 outline-none rounded-md ml-2 px-2 py-1"
              />
            </div>
          )}
        </div>
        <button
          disabled={
            newLinkFetchState === "loading" ||
            !getFieldState("original_url").invalid
          }
          className="bg-stone-300 px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {newLinkFetchState === "loading" ? (
            <ReactLoading
              type="spin"
              color="#ffffff"
              height="25px"
              width="25px"
            />
          ) : (
            "Generate Url"
          )}
        </button>
      </form>
      <DevTool control={control} />
    </>
  );
};

export default CreateShortendLink;
